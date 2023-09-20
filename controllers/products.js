const { HttpError, ctrlWrapper } = require('../helpers');
const mongoose = require('mongoose');

const getCategories = async (req, res) => {
  const collection = mongoose.connection.collection('products');
  const categories = await collection.distinct('category');

  if (!categories.length) {
    throw HttpError(404, 'Not found');
  }

  res.status(200).json({
    categories,
  });
};

const getProducts = async (req, res) => {
  const { bodyParams } = req.user;
  const { page = 1, limit = 20, category, title, recommended } = req.query;
  const skip = (page - 1) * limit;

  const filter = { category, title };

  if (favorite) {
    filter.favorite = favorite;
  }

  const result = await Contact.find(filter, '-__v', {
    skip,
    limit,
  }).populate('owner', 'email subscription');
  res.json(result);

  if (!categories.length) {
    throw HttpError(404, 'Not found');
  }

  res.status(200).json({
    categories,
  });
};

module.exports = {
  getDiaries: ctrlWrapper(getCategories),
};
