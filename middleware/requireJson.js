const WRITE_METHODS = new Set(["POST", "PUT", "PATCH"]);

const requireJson = (req, res, next) => {
  if (!WRITE_METHODS.has(req.method)) {
    return next();
  }

  if (req.is("application/json")) {
    return next();
  }

  return res.status(415).json({
    message: "Unsupported Media Type",
    error: "Content-Type must be application/json",
  });
};

module.exports = requireJson;
