const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const doneExerciseSchema = new Schema(
  {
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: 'exercise',
      required: [true, 'Set exercise id'],
    },
    date: {
      type: String,
      required: [true, 'Set date'],
    },
    duration: {
      type: Number,
      required: [true, 'Set exercise duration'],
    },
    // calories: {
    //   type: Number,
    //   required: [true, 'Missing number of burned calories'],
    // },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: false }
);

doneExerciseSchema.post('save', handleMongooseError);

const postDoneExerciseSchema = Joi.object({
  exerciseId: Joi.string().required().messages({
    'any.required': 'Missing required exerciseId',
  }),
  date: Joi.date().iso().required().messages({
    'any.required': 'Missing required date',
  }),
  duration: Joi.number().min(1).required().messages({
    'any.required': 'Missing required duration of the done exercise',
  }),
  // calories: Joi.number().min(1).required().messages({
  //   'any.required': 'Missing required number of burned calories',
  // }),
});

const schemas = {
  postDoneExerciseSchema,
};

const DoneExercise = model('doneExercise', doneExerciseSchema);

module.exports = {
  DoneExercise,
  schemas,
};
