const CartItem = require("../models/cartItem");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findCartItemOr404 = async (id, res) => {
  const cartItem = await CartItem.findByPk(id);
  if (!cartItem) {
    res.status(404).json({ message: "Cart item not found" });
    return null;
  }
  return cartItem;
};

const createCartItem = async (req, res) => {
  try {
    const { cartId, productId, quantity, unitPrice } = req.body;
    const cartItem = await CartItem.create({
      cartId,
      productId,
      quantity,
      unitPrice,
    });
    return res.status(201).json(cartItem);
  } catch (error) {
    return sendServerError(res, "Failed to create cart item", error, 400);
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll();
    return res.status(200).json(cartItems);
  } catch (error) {
    return sendServerError(res, "Failed to fetch cart items", error);
  }
};

const getCartItemById = async (req, res) => {
  try {
    const cartItem = await findCartItemOr404(req.params.id, res);
    if (!cartItem) return;
    return res.status(200).json(cartItem);
  } catch (error) {
    return sendServerError(res, "Failed to fetch cart item", error);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartItem = await findCartItemOr404(req.params.id, res);
    if (!cartItem) return;

    const { cartId, productId, quantity, unitPrice } = req.body;
    const payload = { cartId, productId, quantity, unitPrice };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await cartItem.update(updates);
    return res.status(200).json(cartItem);
  } catch (error) {
    return sendServerError(res, "Failed to update cart item", error, 400);
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const cartItem = await findCartItemOr404(req.params.id, res);
    if (!cartItem) return;

    await cartItem.destroy();
    return res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete cart item", error);
  }
};

module.exports = {
  createCartItem,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};
