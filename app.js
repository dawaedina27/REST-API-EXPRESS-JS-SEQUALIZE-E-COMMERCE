const express = require("express");
require("dotenv").config();

const sequelize = require("./config/db");
const setupSwagger = require("./config/swagger");
const Product = require("./models/product");
const Order = require("./models/order");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Parse JSON request bodies.
app.use(express.json());

// One Product -> Many Orders relationship.
Product.hasMany(Order, { foreignKey: "productId", as: "orders" });

// Every Order belongs to one Product.
Order.belongsTo(Product, { foreignKey: "productId", as: "product" });

app.get("/", (req, res) => {
  res.status(200).json({ message: "E-commerce API is running" });
});

// Swagger API docs.
setupSwagger(app);

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    // Verify DB credentials first, then create/update tables.
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connected and synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database.");
    console.error("message:", error.message);
    if (error.parent?.code) console.error("code:", error.parent.code);
    if (error.parent?.sqlMessage)
      console.error("sqlMessage:", error.parent.sqlMessage);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
