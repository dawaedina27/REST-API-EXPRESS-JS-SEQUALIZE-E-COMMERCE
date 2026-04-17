const Product = require("../models/product");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findProductOr404 = async (id, res) => {
  const product = await Product.findByPk(id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return null;
  }
  return product;
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({ name, description, price, stock });
    return res.status(201).json(product);
  } catch (error) {
    return sendServerError(res, "Failed to create product", error, 400);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return sendServerError(res, "Failed to fetch products", error);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await findProductOr404(req.params.id, res);
    if (!product) return;
    return res.status(200).json(product);
  } catch (error) {
    return sendServerError(res, "Failed to fetch product", error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await findProductOr404(req.params.id, res);
    if (!product) return;

    const { name, description, price, stock } = req.body;
    const payload = { name, description, price, stock };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await product.update(updates);
    return res.status(200).json(product);
  } catch (error) {
    return sendServerError(res, "Failed to update product", error, 400);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await findProductOr404(req.params.id, res);
    if (!product) return;

    await product.destroy();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete product", error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
