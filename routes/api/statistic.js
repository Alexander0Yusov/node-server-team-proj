const express = require('express'); 
const ctrl = require('../../controllers/statistic'); 
const { validateBody } = require('../../middelwares');
const { schemas } = require('../../models/user');
const router = express.Router(); 

router.get('/', ctrl.getAllUsers); 

module.exports = router; 