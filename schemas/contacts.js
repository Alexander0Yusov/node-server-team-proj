const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  favorite: Joi.boolean(),
});

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
  }),
});

module.exports = {
  addSchema,
  putSchema,
  updateFavoriteSchema,
};
