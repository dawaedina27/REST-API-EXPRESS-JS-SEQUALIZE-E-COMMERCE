const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Shipment model tracks delivery lifecycle for an order.
const Shipment = sequelize.define(
  "Shipment",
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
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "PACKED",
        "SHIPPED",
        "DELIVERED",
        "RETURNED",
      ),
      defaultValue: "PENDING",
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "shipments",
    timestamps: true,
  },
);

module.exports = Shipment;
