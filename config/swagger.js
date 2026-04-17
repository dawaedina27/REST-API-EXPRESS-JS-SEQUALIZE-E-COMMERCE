const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/api-docs.json", (req, res) => {
    res.status(200).json(swaggerDocument);
  });
};

module.exports = setupSwagger;
