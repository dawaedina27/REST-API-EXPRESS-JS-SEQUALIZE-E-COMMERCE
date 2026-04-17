const Inventory = require("../models/inventory");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findInventoryEntryOr404 = async (id, res) => {
  const inventoryEntry = await Inventory.findByPk(id);
  if (!inventoryEntry) {
    res.status(404).json({ message: "Inventory entry not found" });
    return null;
  }
  return inventoryEntry;
};

const createInventoryEntry = async (req, res) => {
  try {
    const { productId, changeType, quantityChange, note } = req.body;
    const inventoryEntry = await Inventory.create({
      productId,
      changeType,
      quantityChange,
      note,
    });
    return res.status(201).json(inventoryEntry);
  } catch (error) {
    return sendServerError(res, "Failed to create inventory entry", error, 400);
  }
};

const getInventoryEntries = async (req, res) => {
  try {
    const inventoryEntries = await Inventory.findAll();
    return res.status(200).json(inventoryEntries);
  } catch (error) {
    return sendServerError(res, "Failed to fetch inventory entries", error);
  }
};

const getInventoryEntryById = async (req, res) => {
  try {
    const inventoryEntry = await findInventoryEntryOr404(req.params.id, res);
    if (!inventoryEntry) return;
    return res.status(200).json(inventoryEntry);
  } catch (error) {
    return sendServerError(res, "Failed to fetch inventory entry", error);
  }
};

const updateInventoryEntry = async (req, res) => {
  try {
    const inventoryEntry = await findInventoryEntryOr404(req.params.id, res);
    if (!inventoryEntry) return;

    const { productId, changeType, quantityChange, note } = req.body;
    const payload = { productId, changeType, quantityChange, note };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await inventoryEntry.update(updates);
    return res.status(200).json(inventoryEntry);
  } catch (error) {
    return sendServerError(res, "Failed to update inventory entry", error, 400);
  }
};

const deleteInventoryEntry = async (req, res) => {
  try {
    const inventoryEntry = await findInventoryEntryOr404(req.params.id, res);
    if (!inventoryEntry) return;

    await inventoryEntry.destroy();
    return res
      .status(200)
      .json({ message: "Inventory entry deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete inventory entry", error);
  }
};

module.exports = {
  createInventoryEntry,
  getInventoryEntries,
  getInventoryEntryById,
  updateInventoryEntry,
  deleteInventoryEntry,
};
