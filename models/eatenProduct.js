const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers');

const eatenProductSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Set date'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: [true, 'Set product id'],
    },
    weight: {
      type: Number,
      required: [true, 'Set product weight'],
    },
  },

  { versionKey: false, timestamps: false }
);

eatenProductSchema.post('save', handleMongooseError);

const eatenProductJoiSchemaPost = Joi.object({
  productId: Joi.string().required(),
  weight: Joi.number().required(),
  date: Joi.date().iso().required(),
});

const schemas = { eatenProductJoiSchemaPost };

const EatenProduct = model('eatenProduct', eatenProductSchema);

module.exports = { EatenProduct, schemas };
