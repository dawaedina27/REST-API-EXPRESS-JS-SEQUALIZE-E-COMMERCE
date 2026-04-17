const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Cart model tracks a user's in-progress or completed shopping session.
const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "CHECKED_OUT", "ABANDONED"),
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "carts",
    timestamps: true,
  },
);

module.exports = Cart;
