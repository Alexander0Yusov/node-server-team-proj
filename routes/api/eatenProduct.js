const express = require('express');
const router = express.Router();
const { authenticate, validateBody, isValidId } = require('../../middelwares');
const { schemas } = require('../../models/eatenProduct');
const ctrl = require('../../controllers/eatenProduct');

router.post(
  '/',
  authenticate,
  validateBody(schemas.eatenProductJoiSchemaPost),
  ctrl.postEatenProduct
);

router.delete('/:id', authenticate, isValidId, ctrl.deleteEatenProductById);

module.exports = router;
