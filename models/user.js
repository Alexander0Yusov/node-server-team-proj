const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers');

const validEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const validPassword =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/;

const bodyParamsSchema = new Schema({
  _id: false,
  height: {
    type: Number,
    min: 150,
    max: 250,
    default: 150,
    required: true,
  },
  currentWeight: {
    type: Number,
    min: 35,
    max: 300,
    default: 35,
    required: true,
  },
  desiredWeight: {
    type: Number,
    min: 35,
    max: 300,
    default: 35,
    required: true,
  },
  birthdate: {
    type: Date,
    validate: {
      validator: function (value) {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - 18);
        return value <= currentDate;
      },
      message: 'The date must be 18 years or earlier than the current date',
    },
    default: () => {
      let currentDate = new Date();
      return currentDate.setFullYear(currentDate.getFullYear() - 18);
    },
    required: true,
  },
  blood: {
    type: Number,
    enum: [1, 2, 3, 4],
    default: 1,
    required: true,
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true,
  },
  levelActivity: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 1,
    required: true,
  },
  dailySportTime: {
    type: Number,
    default: 110,
    required: true,
    immutable: true,
  },
  bmr: {
    type: Number,
    default: 2280,
    required: true,
  },
  defaultParams: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for user'],
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    token: String,
    avatarURL: String,
    bodyParams: {
      type: bodyParamsSchema,
    },
  },

  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().pattern(new RegExp(validEmail)).required().messages({
    'any.required': 'Please enter your email like sample example@domain.com',
  }),
  password: Joi.string()
    .pattern(new RegExp(validPassword))
    .required()
    .messages({
      'any.required': 'Password must contain 6 letters and 1 number',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(validEmail)).required().messages({
    'any.required': 'Please enter your email like sample example@domain.com',
  }),
  password: Joi.string()
    .pattern(new RegExp(validPassword))
    .required()
    .messages({
      'any.required': 'Password must contain 6 letters and 1 number',
    }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).message('Min 2 and max 50 chars'),
  email: Joi.string().pattern(new RegExp(validEmail)),
  avatarURL: Joi.string(),

  bodyParams: Joi.object({
    height: Joi.number().min(150).max(250).integer(),
    currentWeight: Joi.number().min(35).max(300).integer(),
    desiredWeight: Joi.number().min(35).max(300).integer(),
    birthdate: Joi.date().iso().messages({
      'any.required': 'Please provide a valid ISO date.',
    }),
    blood: Joi.number().valid(1, 2, 3, 4),
    sex: Joi.string().valid('male', 'female'),
    levelActivity: Joi.number().valid(1, 2, 3, 4, 5),
    dailySportTime: Joi.number(),
    bmr: Joi.number(),
    defaultParams: Joi.boolean(),
  }),
});

const schemas = { registerSchema, loginSchema, updateUserSchema };

const User = model('user', userSchema);

module.exports = { User, schemas };
