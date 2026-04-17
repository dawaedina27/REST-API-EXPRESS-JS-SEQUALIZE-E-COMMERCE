const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Order model tracks purchases created from products.
const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM("PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

module.exports = Order;
