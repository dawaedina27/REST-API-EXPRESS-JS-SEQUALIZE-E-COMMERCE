const Cart = require("../models/cart");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findCartOr404 = async (id, res) => {
  const cart = await Cart.findByPk(id);
  if (!cart) {
    res.status(404).json({ message: "Cart not found" });
    return null;
  }
  return cart;
};

const createCart = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const cart = await Cart.create({ userId, status });
    return res.status(201).json(cart);
  } catch (error) {
    return sendServerError(res, "Failed to create cart", error, 400);
  }
};

const getCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    return res.status(200).json(carts);
  } catch (error) {
    return sendServerError(res, "Failed to fetch carts", error);
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await findCartOr404(req.params.id, res);
    if (!cart) return;
    return res.status(200).json(cart);
  } catch (error) {
    return sendServerError(res, "Failed to fetch cart", error);
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await findCartOr404(req.params.id, res);
    if (!cart) return;

    const { userId, status } = req.body;
    const payload = { userId, status };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await cart.update(updates);
    return res.status(200).json(cart);
  } catch (error) {
    return sendServerError(res, "Failed to update cart", error, 400);
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await findCartOr404(req.params.id, res);
    if (!cart) return;

    await cart.destroy();
    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete cart", error);
  }
};

module.exports = {
  createCart,
  getCarts,
  getCartById,
  updateCart,
  deleteCart,
};
