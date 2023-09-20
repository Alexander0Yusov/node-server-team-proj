const { HttpError, ctrlWrapper } = require('../helpers');
const { EatenProduct } = require('../models/eatenProduct');
const mongoose = require('mongoose');

const getDiaries = async (req, res) => {
  const { _id: owner } = req.user;
  const { dateIso } = req.params;

  const [yyyymmdd, _] = dateIso.split('T');

  const filter = {
    date: yyyymmdd,
    owner,
  };

  const meal = await EatenProduct.aggregate([
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

  const collection = mongoose.connection.collection('products'); // Замените на имя вашей коллекции
  const uniqueTitles = await collection.distinct('title');

  res.status(200).json({
    meal,
    uniqueTitles,
    workout: [],
  });
};

module.exports = {
  getDiaries: ctrlWrapper(getDiaries),
};
