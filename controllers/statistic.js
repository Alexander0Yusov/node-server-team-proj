const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');
const cloudinary = require('cloudinary').v2;

const { SECRET_KEY, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: 'dwgi8qlph',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const getAllVideo = async (req, res) => {
  //   if (!result) {
  //     throw HttpError(404);
  //   }
  //   res.json(result);
};

const getAllUsers = async (req, res) => {
  const result = await User.find();
  if (!result) {
    throw HttpError(404);
  }
const allUsers = result.length;
  res.json(allUsers);
};

const getAllTime = async (req, res) => {
    const result = await User.find();

    if (!result) {
      throw HttpError(404);
    }
  
  const allSportTimes = result.reduce((previousValue, users) => {
      return previousValue + users.bodyParams.dailySportTime;
    }, 0);
  
    console.log("time: " + allSportTimes);
  
    res.json(allSportTimes);

};

const getAllTraining = async (req, res) => {};



module.exports = {
  getAllUsers: ctrlWrapper(getAllUsers),
  getAllTime: ctrlWrapper(getAllTime)
};

// Створити публічний ендпоінт, який повертає інформацію щодо

// - кількості відео-тренувань у застосунку

// - загальної кількості спалених усіма зареєстрованими користувачами калорій

// - загальної кількості зареєстрованих у застосунку користувачів

// - загальної кількості годин, проведених зареєстрованими користувачами за тренуванням

// - загальної кількості тренувань, виконаних зареєстрованими користувачами.
