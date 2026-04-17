const express = require("express");
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// Review CRUD endpoints.
router.post("/", createReview);
router.get("/", getReviews);
router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
