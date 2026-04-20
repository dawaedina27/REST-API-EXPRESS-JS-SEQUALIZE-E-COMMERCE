const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_env";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        error: "name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        error: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "CUSTOMER",
    });

    const token = buildToken(user);

    return res.status(201).json({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing credentials",
        error: "email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: "Email or password is incorrect",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: "Email or password is incorrect",
      });
    }

    const token = buildToken(user);

    return res.status(200).json({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
