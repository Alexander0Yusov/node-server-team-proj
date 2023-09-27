const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/statistic');
const { authenticate } = require('../../middelwares');

router.get('/', authenticate, ctrl.getStatistic);

module.exports = router;
