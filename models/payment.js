const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Payment model stores transaction attempts and final payment states.
const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    method: {
      type: DataTypes.ENUM("CARD", "MOBILE_MONEY", "BANK_TRANSFER", "CASH"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "PAID", "FAILED", "REFUNDED"),
      defaultValue: "PENDING",
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
  },
);

module.exports = Payment;
