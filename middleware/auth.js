const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET. Set JWT_SECRET in your environment.");
}

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
    const payload = jwt.verify(token, process.env.JWT_SECRET);
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
