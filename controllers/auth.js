const path = require('path');
const fs = require('fs/promises');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jimp = require('jimp');
const cloudinary = require('cloudinary').v2;

const {
  HttpError,
  ctrlWrapper,
  calcBmr,
  isDefaultParams,
} = require('../helpers');
const { User } = require('../models/user');
const { SECRET_KEY, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUD_NAME } =
  process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
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
  const avatarURL = gravatar.url(String(email));

  const newUser = await User.create({
    ...req.body,
    avatarURL: avatarURL,
    password: hashPassword,
    bodyParams: {},
  });

  const payload = {
    id: newUser._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '7d',
  });
  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
      bodyParams: newUser.bodyParams,
      createdAt: newUser.createdAt,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }, '-updatedAt');
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
    expiresIn: '7d',
  });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      bodyParams: user.bodyParams,
      createdAt: user.createdAt,
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
  const {
    name,
    email,
    avatarURL,
    token,
    createdAt,
    bodyParams = null,
  } = req.user;

  res.json({
    user: {
      name,
      email,
      avatarURL,
      bodyParams,
      createdAt,
    },
    token,
  });
};

const patchUser = async (req, res) => {
  const { _id, email, bodyParams: prevBodyParams } = req.user;

  const {
    name,
    email: incomingEmail,
    bodyParams: incomingBodyParams,
  } = req.body;

  if ((name || incomingEmail || incomingBodyParams || req.file) === undefined) {
    throw HttpError(400, 'missing fields');
  }

  if (incomingEmail && email !== incomingEmail) {
    throw HttpError(401, 'Email editing is not possible');
  }

  let userData = null;

  if (req.file) {
    const { path: tempUpload, originalname } = req.file;

    const filename = `${_id}.${originalname.split('.')[1]}`;
    const resultUpload = path.join(__dirname, '../', 'temp', filename);

    const image = await jimp.read(tempUpload);
    image.resize(600, jimp.AUTO);
    fs.unlink(tempUpload);
    await image.writeAsync(resultUpload);

    const options = {
      folder: 'fit-proj/avatars',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const result = await cloudinary.uploader.upload(resultUpload, options);
    fs.unlink(resultUpload);
    const avatarURL = result.secure_url;
    userData = { avatarURL };
  }

  if (req.body) {
    userData = { ...userData, ...req.body };
  }

  if (incomingBodyParams) {
    const parsedIncomingBodyParams = JSON.parse(incomingBodyParams);
    const parsedPrevBodyParams = JSON.parse(JSON.stringify(prevBodyParams));

    const updatedBodyParams = {
      ...parsedPrevBodyParams,
      ...parsedIncomingBodyParams,
      bmr: calcBmr({ ...parsedPrevBodyParams, ...parsedIncomingBodyParams }),
      defaultParams: false,
    };

    if (isDefaultParams(updatedBodyParams)) {
      updatedBodyParams.defaultParams = true;
    }

    userData.bodyParams = updatedBodyParams;
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { ...userData },
    { new: true }
  );

  res.json({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      avatarURL: updatedUser.avatarURL,
      bodyParams: updatedUser.bodyParams,
    },
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  patchUser: ctrlWrapper(patchUser),
};
