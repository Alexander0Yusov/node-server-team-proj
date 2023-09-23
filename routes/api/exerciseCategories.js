const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middelwares');
const ctrl = require('../../controllers/exerciseCategories');

router.get('/', authenticate, ctrl.getExerciseCategories);

module.exports = router;
