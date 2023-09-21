const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/doneExercises');
const { validateBody, isValidId, authenticate } = require('../../middelwares');
const { schemas } = require('../../models/doneExercises');

router.post(
  '/',
  authenticate,
  validateBody(schemas.postDoneExerciseSchema),
  ctrl.postDoneExercise
);

router.delete('/:id', authenticate, isValidId, ctrl.deleteDoneExercise);

module.exports = router;
