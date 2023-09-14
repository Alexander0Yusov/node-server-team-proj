const express = require("express");
const ctrls = require("../../controllers/contacts");

const router = express.Router();
const {
  validateBody,
  isValidId,
  authenticate,
} = require("./../../middlewares");
const {
  addSchema,
  putSchema,
  updateFavoriteSchema,
} = require("./../../schemas/contacts");

router.get("/", authenticate, ctrls.getAll);

router.get("/:contactId", authenticate, isValidId, ctrls.getById);

router.post("/", authenticate, validateBody(addSchema), ctrls.add);

router.delete("/:contactId", authenticate, isValidId, ctrls.deleteById);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(putSchema),
  ctrls.updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrls.updateStatusContact
);

module.exports = router;
