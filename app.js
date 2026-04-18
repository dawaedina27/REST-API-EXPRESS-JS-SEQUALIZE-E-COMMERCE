const express = require("express");
require("dotenv").config();

const sequelize = require("./config/db");
const setupSwagger = require("./config/swagger");
const Product = require("./models/product");
const Order = require("./models/order");
const User = require("./models/user");
const Category = require("./models/category");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const Payment = require("./models/payment");
const Inventory = require("./models/inventory");
const Shipment = require("./models/shipment");
const Review = require("./models/review");
const ReturnRequest = require("./models/returnRequest");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cartItemRoutes = require("./routes/cartItemRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const returnRequestRoutes = require("./routes/returnRequestRoutes");
const requestLogger = require("./middleware/requestLogger");
const requireJson = require("./middleware/requireJson");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || "v1";
const API_PREFIX = `/api/${API_VERSION}`;

// Parse JSON request bodies.
app.use(express.json());
app.use(requestLogger);
app.use(requireJson);

// One Product -> Many Orders relationship.
Product.hasMany(Order, { foreignKey: "productId", as: "orders" });

// Every Order belongs to one Product.
Order.belongsTo(Product, { foreignKey: "productId", as: "product" });

// One Category -> Many Products relationship.
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

// Every Product belongs to one Category.
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// One User -> Many Carts relationship.
User.hasMany(Cart, { foreignKey: "userId", as: "carts" });

// Every Cart belongs to one User.
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// One Cart -> Many CartItems relationship.
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });

// Every CartItem belongs to one Cart.
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// One Product -> Many CartItems relationship.
Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });

// Every CartItem belongs to one Product.
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// One Order -> Many Payments relationship.
Order.hasMany(Payment, { foreignKey: "orderId", as: "payments" });

// Every Payment belongs to one Order.
Payment.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// One User -> Many Payments relationship.
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });

// Every Payment belongs to one User.
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });

// One Product -> Many Inventory logs relationship.
Product.hasMany(Inventory, { foreignKey: "productId", as: "inventoryLogs" });

// Every inventory log belongs to one Product.
Inventory.belongsTo(Product, { foreignKey: "productId", as: "product" });

// One Order -> Many Shipments relationship.
Order.hasMany(Shipment, { foreignKey: "orderId", as: "shipments" });

// Every Shipment belongs to one Order.
Shipment.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// One Product -> Many Reviews relationship.
Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });

// Every Review belongs to one Product.
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

// One User -> Many Reviews relationship.
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });

// Every Review belongs to one User.
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// One Order -> Many ReturnRequests relationship.
Order.hasMany(ReturnRequest, { foreignKey: "orderId", as: "returns" });

// Every ReturnRequest belongs to one Order.
ReturnRequest.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// One User -> Many ReturnRequests relationship.
User.hasMany(ReturnRequest, { foreignKey: "userId", as: "returns" });

// Every ReturnRequest belongs to one User.
ReturnRequest.belongsTo(User, { foreignKey: "userId", as: "user" });

app.get("/", (req, res) => {
  res.status(200).json({ message: "E-commerce API is running" });
});

// Swagger API docs.
setupSwagger(app);

app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/carts`, cartRoutes);
app.use(`${API_PREFIX}/cart-items`, cartItemRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/inventory`, inventoryRoutes);
app.use(`${API_PREFIX}/shipments`, shipmentRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);
app.use(`${API_PREFIX}/returns`, returnRequestRoutes);

app.use(notFound);
app.use(errorHandler);

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
