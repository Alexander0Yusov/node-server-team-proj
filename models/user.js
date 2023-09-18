const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers');

const validEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const validPassword = /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/;

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
  email: Joi.string()
    .pattern(new RegExp(validEmail))
    .required()
    .message('Please enter your email like sample example@domain.com'),
  password: Joi.string()
    .pattern(new RegExp(validPassword))
    .required()
    .message('Password must contain 6 letters and 1 number'),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(validEmail))
    .required()
    .message('Please enter your email like sample example@domain.com'),
  password: Joi.string()
    .pattern(new RegExp(validPassword))
    .required()
    .message('Password must contain 6 letters and 1 number'),
});

const schemas = { registerSchema, loginSchema };

const User = model('user', userSchema);

module.exports = { User, schemas };
