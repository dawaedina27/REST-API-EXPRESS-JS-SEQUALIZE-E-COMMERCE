const express = require("express");
const {
  createCartItem,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cartItemController");

const router = express.Router();

// Cart item CRUD endpoints.
router.post("/", createCartItem);
router.get("/", getCartItems);
router.get("/:id", getCartItemById);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

module.exports = router;
