const { HttpError, ctrlWrapper } = require('../helpers');
const { EatenProduct } = require('../models/eatenProduct');
const { DoneExercise } = require('../models/doneExercise');
// const { createJsonFilters } = require('../helpers/relocateImg');

const getDiaries = async (req, res) => {
  const { _id: owner } = req.user;
  const { dateIso } = req.params;

  const [yyyymmdd, _] = dateIso.split('T');

  const filter = {
    date: yyyymmdd,
    owner,
  };

  const mealPromise = EatenProduct.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    {
      $unwind: '$product',
    },
    {
      $project: {
        product: 1,
        weight: 1,
      },
    },
  ]);

  const workoutPromise = DoneExercise.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'exercises',
        localField: 'exerciseId',
        foreignField: '_id',
        as: 'exercise',
      },
    },
    {
      $unwind: '$exercise',
    },
    {
      $project: {
        exercise: 1,
        duration: 1,
      },
    },
  ]);

  const [meal, workout] = await Promise.all([mealPromise, workoutPromise]);

  // await createJsonFilters();

  res.status(200).json({
    meal,
    workout,
  });
};

module.exports = {
  getDiaries: ctrlWrapper(getDiaries),
};
