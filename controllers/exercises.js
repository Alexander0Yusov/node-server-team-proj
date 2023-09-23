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

  const aggregatePipeline = [
    {
      $match: filter,
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: Number(limit) }],
        totalCount: [{ $count: 'total' }],
      },
    },
    {
      $unwind: '$totalCount',
    },
  ];

  const Exercises = mongoose.connection.collection('exercises');
  const result = await Exercises.aggregate(aggregatePipeline).toArray();
  const data = result[0]?.data;
  const totalCount = result[0]?.totalCount ? result[0]?.totalCount?.total : 0;

  res.status(200).json({
    totalCount,
    exercises: data || [],
  });
};

module.exports = {
  getExercises: ctrlWrapper(getExercises),
};
