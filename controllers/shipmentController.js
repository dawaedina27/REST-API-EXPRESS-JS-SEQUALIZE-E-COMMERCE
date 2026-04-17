const Shipment = require("../models/shipment");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findShipmentOr404 = async (id, res) => {
  const shipment = await Shipment.findByPk(id);
  if (!shipment) {
    res.status(404).json({ message: "Shipment not found" });
    return null;
  }
  return shipment;
};

const createShipment = async (req, res) => {
  try {
    const { orderId, address, trackingNumber, status, shippedAt, deliveredAt } =
      req.body;
    const shipment = await Shipment.create({
      orderId,
      address,
      trackingNumber,
      status,
      shippedAt,
      deliveredAt,
    });
    return res.status(201).json(shipment);
  } catch (error) {
    return sendServerError(res, "Failed to create shipment", error, 400);
  }
};

const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.findAll();
    return res.status(200).json(shipments);
  } catch (error) {
    return sendServerError(res, "Failed to fetch shipments", error);
  }
};

const getShipmentById = async (req, res) => {
  try {
    const shipment = await findShipmentOr404(req.params.id, res);
    if (!shipment) return;
    return res.status(200).json(shipment);
  } catch (error) {
    return sendServerError(res, "Failed to fetch shipment", error);
  }
};

const updateShipment = async (req, res) => {
  try {
    const shipment = await findShipmentOr404(req.params.id, res);
    if (!shipment) return;

    const { orderId, address, trackingNumber, status, shippedAt, deliveredAt } =
      req.body;
    const payload = {
      orderId,
      address,
      trackingNumber,
      status,
      shippedAt,
      deliveredAt,
    };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await shipment.update(updates);
    return res.status(200).json(shipment);
  } catch (error) {
    return sendServerError(res, "Failed to update shipment", error, 400);
  }
};

const deleteShipment = async (req, res) => {
  try {
    const shipment = await findShipmentOr404(req.params.id, res);
    if (!shipment) return;

    await shipment.destroy();
    return res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete shipment", error);
  }
};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
};
