const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// User model stores customer account details.
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("CUSTOMER", "ADMIN"),
      allowNull: false,
      defaultValue: "CUSTOMER",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

module.exports = User;
