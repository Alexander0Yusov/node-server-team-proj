const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middelwares');
const ctrl = require('../../controllers/products');

router.get('/categories', authenticate, ctrl.getCategories);
router.get('/', authenticate, ctrl.getProducts);

module.exports = router;
