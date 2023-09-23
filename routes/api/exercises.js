const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middelwares');
const ctrl = require('../../controllers/exercises');

router.get('/', authenticate, ctrl.getExercises);

module.exports = router;
