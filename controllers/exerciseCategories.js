const { HttpError, ctrlWrapper } = require('../helpers');
const mongoose = require('mongoose');

const getExerciseCategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { category } = req.params;
  const skip = (page - 1) * limit;

  const filterCategories = ['Body parts', 'Muscles', 'Equipment'];
  let filterValue = '';

  if (category) {
    switch (category) {
      case 'bodyparts':
        filterValue = filterCategories[0];
        break;
      case 'muscles':
        filterValue = filterCategories[1];
        break;
      case 'equipment':
        filterValue = filterCategories[2];
        break;

      default:
        throw HttpError(404, 'Category not found');
    }
  }

  const findObj = {};

  if (filterValue) {
    findObj.filter = filterValue;
  }
  console.log(findObj);

  const Filters = mongoose.connection.collection('filters');
  const result = await Filters.find(findObj)
    .skip(skip)
    .limit(Number(limit))
    .toArray();

  res.status(200).json({
    exerciseCategories: result,
  });
};

module.exports = {
  getExerciseCategories: ctrlWrapper(getExerciseCategories),
};
