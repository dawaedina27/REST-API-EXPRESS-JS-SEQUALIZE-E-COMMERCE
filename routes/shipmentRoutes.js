const express = require("express");
const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
} = require("../controllers/shipmentController");

const router = express.Router();

// Shipment CRUD endpoints.
router.post("/", createShipment);
router.get("/", getShipments);
router.get("/:id", getShipmentById);
router.put("/:id", updateShipment);
router.delete("/:id", deleteShipment);

module.exports = router;
