const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Inventory model logs stock movements for auditability.
const Inventory = sequelize.define(
  "Inventory",
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
    changeType: {
      type: DataTypes.ENUM("RESTOCK", "SALE", "RETURN", "ADJUSTMENT"),
      allowNull: false,
    },
    quantityChange: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "inventory_movements",
    timestamps: true,
  },
);

module.exports = Inventory;
