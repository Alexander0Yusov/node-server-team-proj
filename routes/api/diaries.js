const express = require('express');
const router = express.Router();
const { authenticate, isValidDate } = require('../../middelwares');
const ctrl = require('../../controllers/diaries');

router.get('/:dateIso', authenticate, isValidDate, ctrl.getDiaries);

module.exports = router;
