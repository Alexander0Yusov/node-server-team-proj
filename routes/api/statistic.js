const express = require('express');
const { getAllUsers, getAllTime } = require('../../controllers/statistic');
const router = express.Router();


router.get('/all-users', getAllUsers);
router.get('/all-time', getAllTime);


module.exports = router;