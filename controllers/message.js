const { HttpError, ctrlWrapper } = require('../helpers');
const { Message } = require('../models/message');

const getAllMessage = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Message.find(
    { roomId: id, owner },
    '-createdAt -updatedAt'
  );

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const addMessage = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Message.create({
    ...req.body,
    owner,
  });
  res.status(201).json(result);
};

module.exports = {
  getAllMessage: ctrlWrapper(getAllMessage),
  addMessage: ctrlWrapper(addMessage),
};
