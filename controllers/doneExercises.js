const { DoneExercise } = require('../models/doneExercise');
const { HttpError, ctrlWrapper } = require('../helpers');

const deleteDoneExercise = async (req, res) => {
  const { id } = req.params;
  const result = await DoneExercise.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({
    id: result._id,
    exerciseId: result.exerciseId,
    duration: result.duration,
  });
};

const postDoneExercise = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.body;
  const [yyyymmdd, _] = date.split('T');
  const result = await DoneExercise.create({
    ...req.body,
    date: yyyymmdd,
    owner,
  });
  res.status(201).json({
    id: result._id,
    exerciseId: result.exerciseId,
    duration: result.duration,
  });
};

module.exports = {
  deleteDoneExercise: ctrlWrapper(deleteDoneExercise),
  postDoneExercise: ctrlWrapper(postDoneExercise),
};
