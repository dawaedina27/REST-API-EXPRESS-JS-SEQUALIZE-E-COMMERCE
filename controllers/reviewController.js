const Review = require("../models/review");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findReviewOr404 = async (id, res) => {
  const review = await Review.findByPk(id);
  if (!review) {
    res.status(404).json({ message: "Review not found" });
    return null;
  }
  return review;
};

const createReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    const review = await Review.create({ productId, userId, rating, comment });
    return res.status(201).json(review);
  } catch (error) {
    return sendServerError(res, "Failed to create review", error, 400);
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    return res.status(200).json(reviews);
  } catch (error) {
    return sendServerError(res, "Failed to fetch reviews", error);
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await findReviewOr404(req.params.id, res);
    if (!review) return;
    return res.status(200).json(review);
  } catch (error) {
    return sendServerError(res, "Failed to fetch review", error);
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await findReviewOr404(req.params.id, res);
    if (!review) return;

    const { productId, userId, rating, comment } = req.body;
    const payload = { productId, userId, rating, comment };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await review.update(updates);
    return res.status(200).json(review);
  } catch (error) {
    return sendServerError(res, "Failed to update review", error, 400);
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await findReviewOr404(req.params.id, res);
    if (!review) return;

    await review.destroy();
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete review", error);
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
