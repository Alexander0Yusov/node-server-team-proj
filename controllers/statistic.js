const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');
const { DoneExercise } = require('../models/doneExercise');

const getAllUsers = async (req, res) => {
  const allUsers = await User.find();
  if (!allUsers) {
    throw HttpError(404);
  }

  const allExercises = await DoneExercise.find();
  if (!allExercises) {
    throw HttpError(404);
  }

  let allExercisesTime = 0 / 60;

  allExercises.forEach(obj => {
    allExercisesTime += obj.duration;
  });

  const allExercisesHours = Math.round(allExercisesTime / 60);

  res.json([allUsers.length, allExercises.length, allExercisesHours]);
};

module.exports = {
  getAllUsers: ctrlWrapper(getAllUsers),
};

// Створити публічний ендпоінт, який повертає інформацію щодо
// - кількості відео-тренувань у застосунку
// - загальної кількості спалених усіма зареєстрованими користувачами калорій
// - загальної кількості зареєстрованих у застосунку користувачів
// - загальної кількості годин, проведених зареєстрованими користувачами за тренуванням
// - загальної кількості тренувань, виконаних зареєстрованими користувачами.
