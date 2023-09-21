const { HttpError, ctrlWrapper } = require('../helpers');
const { EatenProduct } = require('../models/eatenProduct');

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

  res.status(200).json({
    meal,
    workout: [],
  });
};

module.exports = {
  getDiaries: ctrlWrapper(getDiaries),
};
