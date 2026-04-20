const User = require("../models/user");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const safeUserAttributes = {
  exclude: ["passwordHash"],
};

const findUserOr404 = async (id, res) => {
  const user = await User.findByPk(id, { attributes: safeUserAttributes });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }
  return user;
};

const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.create({ name, email, role });
    return res.status(201).json(user);
  } catch (error) {
    return sendServerError(res, "Failed to create user", error, 400);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: safeUserAttributes });
    return res.status(200).json(users);
  } catch (error) {
    return sendServerError(res, "Failed to fetch users", error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await findUserOr404(req.params.id, res);
    if (!user) return;
    return res.status(200).json(user);
  } catch (error) {
    return sendServerError(res, "Failed to fetch user", error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await findUserOr404(req.params.id, res);
    if (!user) return;

    const { name, email, role } = req.body;
    const payload = { name, email, role };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await user.update(updates);
    return res.status(200).json(user);
  } catch (error) {
    return sendServerError(res, "Failed to update user", error, 400);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await findUserOr404(req.params.id, res);
    if (!user) return;

    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete user", error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
