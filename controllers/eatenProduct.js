const { HttpError, ctrlWrapper } = require('../helpers');
const { EatenProduct } = require('../models/eatenProduct');

const postEatenProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.body;

  const [yyyymmdd, _] = date.split('T');

  const result = await EatenProduct.create({
    ...req.body,
    date: yyyymmdd,
    owner,
  });

  res.status(201).json({
    _id: result._id,
    productId: result.productId,
    weight: result.weight,
  });
};

const deleteEatenProductById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await EatenProduct.findByIdAndDelete(id)
    .where('owner')
    .equals(owner);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json({
    _id: result._id,
    productId: result.productId,
    weight: result.weight,
  });
};

module.exports = {
  postEatenProduct: ctrlWrapper(postEatenProduct),
  deleteEatenProductById: ctrlWrapper(deleteEatenProductById),
};
