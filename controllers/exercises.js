const { HttpError, ctrlWrapper } = require('../helpers');
const mongoose = require('mongoose');

const getExercises = async (req, res) => {
  const { page = 1, limit = 10, bodyPart, equipment, target } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};

  if (bodyPart) {
    filter.bodyPart = bodyPart;
  }
  if (equipment) {
    filter.equipment = equipment;
  }
  if (target) {
    filter.target = target;
  }

  const Exercises = mongoose.connection.collection('exercises');

  const result = await Exercises.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .toArray();

  res.status(200).json({
    exercises: result,
  });
};

module.exports = {
  getExercises: ctrlWrapper(getExercises),
};
