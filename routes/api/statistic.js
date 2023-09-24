const express = require('express');
const ctrl = require('../../controllers/statistic');
const { authenticate } = require('../../middelwares');
const router = express.Router();

router.get('/', authenticate, ctrl.getAllUsers);

module.exports = router;
