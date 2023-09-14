const Contact = require("../models/contact");
const { HttpError, ctrlWrapper } = require("./../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = false } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner };

  if (favorite) {
    filter.favorite = favorite;
  }

  const result = await Contact.find(filter, "-__v", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  res.json(result);
};

const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findById(contactId).where("owner").equals(owner);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId)
    .where("owner")
    .equals(owner);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
  const { _id: owner } = req.user;
  const { name, email, phone, favorite } = req.body;
  if (!(name || email || phone || favorite !== undefined)) {
    throw HttpError(400, "missing fields");
  }

  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  })
    .where("owner")
    .equals(owner);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  })
    .where("owner")
    .equals(owner);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
