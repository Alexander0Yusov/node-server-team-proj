const { HttpError, ctrlWrapper } = require('../helpers');
const mongoose = require('mongoose');

const getCategories = async (req, res) => {
  const collection = mongoose.connection.collection('products');
  const categories = await collection.distinct('category');

  if (!categories.length) {
    throw HttpError(404, 'Not found');
  }

  res.status(200).json({ categories });
};

const getProducts = async (req, res) => {
  const {
    bodyParams: { blood },
  } = req.user;
  const { page = 1, limit = 10, category, title, recommended } = req.query;
  const skip = (page - 1) * limit;

  const filter = [];

  if (category) {
    filter.push({ category });
  }
  if (title) {
    filter.push({ title: { $regex: String(title), $options: 'i' } });
  }
  if (recommended === 'false') {
    filter.push({ [`groupBloodNotAllowed.${blood}`]: false });
  }
  if (recommended === 'true') {
    filter.push({ [`groupBloodNotAllowed.${blood}`]: true });
  }

  const Products = mongoose.connection.collection('products');
  let result;

  if (filter.length === 0) {
    result = await Products.find({}).skip(skip).limit(limit).toArray();
  } else {
    result = await Products.find({
      $and: filter,
    })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  res.status(200).json({
    result,
  });
};

module.exports = {
  getCategories: ctrlWrapper(getCategories),
  getProducts: ctrlWrapper(getProducts),
};
