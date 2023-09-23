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

  let matchObj = {};
  if (filter.length !== 0) {
    matchObj = {
      $and: filter,
    };
  }

  const aggregatePipeline = [
    {
      $match: matchObj,
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
  const Products = mongoose.connection.collection('products');
  const result = await Products.aggregate(aggregatePipeline).toArray();
  const data = result[0]?.data;
  const totalCount = result[0]?.totalCount ? result[0]?.totalCount?.total : 0;

  res.status(200).json({
    totalCount,
    products: data || [],
  });
};

module.exports = {
  getCategories: ctrlWrapper(getCategories),
  getProducts: ctrlWrapper(getProducts),
};
