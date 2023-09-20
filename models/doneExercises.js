const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const doneExerciseSchema = new Schema(
  {
    exerciseId: {
      type: String,
      required: [true, 'Missing exercise'],
    },
    date: {
      type: String,
      required: [true, 'Missing date'],
    },
    time: {
      type: Number,
      required: [true, 'Missing duration of the done exercise'],
    },
    calories: {
      type: Number,
      required: [true, 'Missing number of burned calories'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: false }
);

doneExerciseSchema.post('save', handleMongooseError);

const addDoneExerciseSchema = Joi.object({
  exerciseId: Joi.string().required().messages({
    'any.required': 'Missing required exerciseId',
  }),
  date: Joi.string().required().messages({
    'any.required': 'Missing required date',
  }),
  time: Joi.number().min(1).required().messages({
    'any.required': 'Missing required duration of the done exercise',
  }),
  calories: Joi.number().min(1).required().messages({
    'any.required': 'Missing required number of burned calories',
  }),
});

const updateDoneExerciseSchema = Joi.object({
  exerciseId: Joi.string(),
  date: Joi.string(),
  time: Joi.number().min(1),
  calories: Joi.number().min(1),
});

const schemas = {
  addDoneExerciseSchema,
  updateDoneExerciseSchema,
};

const DoneExercise = model('doneExercise', doneExerciseSchema);

module.exports = {
  DoneExercise,
  schemas,
};
