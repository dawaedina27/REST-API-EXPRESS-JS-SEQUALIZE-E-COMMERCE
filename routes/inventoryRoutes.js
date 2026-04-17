const express = require("express");
const {
  createInventoryEntry,
  getInventoryEntries,
  getInventoryEntryById,
  updateInventoryEntry,
  deleteInventoryEntry,
} = require("../controllers/inventoryController");

const router = express.Router();

// Inventory CRUD endpoints.
router.post("/", createInventoryEntry);
router.get("/", getInventoryEntries);
router.get("/:id", getInventoryEntryById);
router.put("/:id", updateInventoryEntry);
router.delete("/:id", deleteInventoryEntry);

module.exports = router;
