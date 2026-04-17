const express = require("express");
const {
  createReturnRequest,
  getReturnRequests,
  getReturnRequestById,
  updateReturnRequest,
  deleteReturnRequest,
} = require("../controllers/returnRequestController");

const router = express.Router();

// Return request CRUD endpoints.
router.post("/", createReturnRequest);
router.get("/", getReturnRequests);
router.get("/:id", getReturnRequestById);
router.put("/:id", updateReturnRequest);
router.delete("/:id", deleteReturnRequest);

module.exports = router;
