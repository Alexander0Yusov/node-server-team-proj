const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');
const { DoneExercise } = require('../models/doneExercise');

const getAllUsers = async (req, res) => {
  const allUsersCountPromise = User.countDocuments({});
  const allExercisesCountPromise = DoneExercise.countDocuments({});
  const allExercisesMinutesPromise = DoneExercise.aggregate([
    {
      $group: {
        _id: null,
        totalDuration: { $sum: { $toInt: '$duration' } },
      },
    },
  ]);

  const [allUsersCount, allExercisesCount, allExercisesMinutes] =
    await Promise.all([
      allUsersCountPromise,
      allExercisesCountPromise,
      allExercisesMinutesPromise,
    ]);

  res.json({
    totalUsersCount: allUsersCount,
    totalExercisesCount: allExercisesCount,
    totalExercisesDuration: allExercisesMinutes[0].totalDuration,
  });
};

module.exports = {
  getAllUsers: ctrlWrapper(getAllUsers),
};

// Створити публічний ендпоінт, який повертає інформацію щодо
// - кількості відео-тренувань у застосунку
// - загальної кількості спалених усіма зареєстрованими користувачами калорій
// - загальної кількості зареєстрованих у застосунку користувачів +
// - загальної кількості годин, проведених зареєстрованими користувачами за тренуванням +
// - загальної кількості тренувань, виконаних зареєстрованими користувачами. +
