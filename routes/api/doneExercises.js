const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/doneExercises');
const { validateBody, isValidId, authenticate } = require('../../middelwares');
const { schemas } = require('../../models/doneExercises');

router.post(
  '/',
  authenticate,
  validateBody(schemas.addDoneExerciseSchema),
  ctrl.addDoneExercise
);

router.patch(
  '/:id',
  authenticate,
  isValidId,
  validateBody(schemas.updateDoneExerciseSchema),
  ctrl.updateDoneExercise
);

router.delete('/:id', authenticate, isValidId, ctrl.removeDoneExercise);

module.exports = router;
