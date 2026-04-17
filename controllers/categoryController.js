const Category = require("../models/category");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findCategoryOr404 = async (id, res) => {
  const category = await Category.findByPk(id);
  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return null;
  }
  return category;
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    return res.status(201).json(category);
  } catch (error) {
    return sendServerError(res, "Failed to create category", error, 400);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (error) {
    return sendServerError(res, "Failed to fetch categories", error);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await findCategoryOr404(req.params.id, res);
    if (!category) return;
    return res.status(200).json(category);
  } catch (error) {
    return sendServerError(res, "Failed to fetch category", error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await findCategoryOr404(req.params.id, res);
    if (!category) return;

    const { name, description } = req.body;
    const payload = { name, description };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await category.update(updates);
    return res.status(200).json(category);
  } catch (error) {
    return sendServerError(res, "Failed to update category", error, 400);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await findCategoryOr404(req.params.id, res);
    if (!category) return;

    await category.destroy();
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete category", error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
