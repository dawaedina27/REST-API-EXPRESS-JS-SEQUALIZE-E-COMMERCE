const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_env";

const authenticateToken = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Unauthorized",
      error: "Missing or invalid Bearer token",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
      error: "Token is invalid or expired",
    });
  }
};

const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
        error: "Authentication is required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
        error: "You do not have permission to perform this action",
      });
    }

    return next();
  };

module.exports = {
  authenticateToken,
  authorizeRoles,
};
