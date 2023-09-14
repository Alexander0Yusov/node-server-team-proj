const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    owner: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

messageSchema.post('save', handleMongooseError);

const Message = model('message', messageSchema);

module.exports = { Message };
