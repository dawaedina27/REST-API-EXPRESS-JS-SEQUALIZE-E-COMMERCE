const express = require("express");
const {
  createCart,
  getCarts,
  getCartById,
  updateCart,
  deleteCart,
} = require("../controllers/cartController");

const router = express.Router();

// Cart CRUD endpoints.
router.post("/", createCart);
router.get("/", getCarts);
router.get("/:id", getCartById);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

module.exports = router;
