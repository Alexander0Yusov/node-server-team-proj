const path = require('path');
const fs = require('fs/promises');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jimp = require('jimp');
const cloudinary = require('cloudinary').v2;

const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');
const { SECRET_KEY, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: 'dwgi8qlph',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email is already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
  });

  const payload = {
    id: newUser._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h',
  });
  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }, '-createdAt -updatedAt');
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h',
  });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    },
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).json('No Content');
};

const getCurrent = async (req, res) => {
  const { name, email, avatarURL, token, bodyParams = null } = req.user;

  res.json({
    user: {
      name,
      email,
      avatarURL,
      token,
      bodyParams,
    },
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw HttpError(401);
  }
  const { path: tempDir } = req.file;

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(tempDir, options);
    const avatarURL = result.secure_url;

    await User.findByIdAndUpdate(_id, { avatarURL });

    return avatarURL;
  } catch (error) {
    console.error(error);
  }

  res.json({
    avatarURL,
  });
};

const patchUser = async (req, res) => {
  const { _id, bodyParams: _bodyParams } = req.user;

  const { name, email, bodyParams } = req.body;

  if ((name || email || bodyParams || req.file) === undefined) {
    throw HttpError(400, 'missing fields');
  }

  let updateObj = null;

  if (req.file) {
    const { path: tempUpload, originalname } = req.file;

    const filename = `${_id}.${originalname.split('.')[1]}`;
    const resultUpload = path.join(__dirname, '../', 'temp', filename);

    const image = await jimp.read(tempUpload);
    image.resize(500, jimp.AUTO);
    fs.unlink(tempUpload);
    await image.writeAsync(resultUpload);

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const result = await cloudinary.uploader.upload(resultUpload, options);
    fs.unlink(resultUpload);
    const avatarURL = result.secure_url;
    updateObj = { avatarURL };
  }

  if (req.body) {
    updateObj = { ...updateObj, ...req.body };
  }

  if (bodyParams) {
    updateObj.bodyParams = { ..._bodyParams, ...bodyParams };
  }

  await User.findByIdAndUpdate(_id, { ...updateObj });

  res.json({ ...updateObj });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
  patchUser: ctrlWrapper(patchUser),
};
