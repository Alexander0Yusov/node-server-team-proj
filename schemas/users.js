const Joi = require("joi");
const { emailRegexp, subscriptionList } = require("./defaults");

const userRegisterLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required field email",
  }),
});

const userSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

module.exports = {
  userRegisterLoginSchema,
  userSubscriptionSchema,
  userVerifySchema,
};
