const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// ReturnRequest model tracks post-purchase return/refund requests.
const ReturnRequest = sequelize.define(
  "ReturnRequest",
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
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "REQUESTED",
        "APPROVED",
        "REJECTED",
        "RECEIVED",
        "REFUNDED",
      ),
      defaultValue: "REQUESTED",
    },
  },
  {
    tableName: "return_requests",
    timestamps: true,
  },
);

module.exports = ReturnRequest;
