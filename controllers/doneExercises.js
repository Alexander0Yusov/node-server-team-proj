const { DoneExercise } = require('../models/doneExercises');
const { HttpError, ctrlWrapper } = require('../helpers');

const removeDoneExercise = async (req, res) => {
  const { id } = req.params;
  const result = await DoneExercise.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({
    message: 'Exercise deleted',
  });
};

const addDoneExercise = async (req, res) => {
  const { _id: user } = req.user;
  const { date } = req.body;
  const [yyyymmdd, _] = date.split('T');
  const result = await DoneExercise.create({
    ...req.body,
    date: yyyymmdd,
    user,
  });
  res.status(201).json(result);
};

const updateDoneExercise = async (req, res) => {
  const { id } = req.params;
  const result = await DoneExercise.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

module.exports = {
  removeDoneExercise: ctrlWrapper(removeDoneExercise),
  addDoneExercise: ctrlWrapper(addDoneExercise),
  updateDoneExercise: ctrlWrapper(updateDoneExercise),
};
