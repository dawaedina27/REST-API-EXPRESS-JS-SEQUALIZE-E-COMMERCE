const ReturnRequest = require("../models/returnRequest");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findReturnRequestOr404 = async (id, res) => {
  const returnRequest = await ReturnRequest.findByPk(id);
  if (!returnRequest) {
    res.status(404).json({ message: "Return request not found" });
    return null;
  }
  return returnRequest;
};

const createReturnRequest = async (req, res) => {
  try {
    const { orderId, userId, reason, status } = req.body;
    const returnRequest = await ReturnRequest.create({
      orderId,
      userId,
      reason,
      status,
    });
    return res.status(201).json(returnRequest);
  } catch (error) {
    return sendServerError(res, "Failed to create return request", error, 400);
  }
};

const getReturnRequests = async (req, res) => {
  try {
    const returnRequests = await ReturnRequest.findAll();
    return res.status(200).json(returnRequests);
  } catch (error) {
    return sendServerError(res, "Failed to fetch return requests", error);
  }
};

const getReturnRequestById = async (req, res) => {
  try {
    const returnRequest = await findReturnRequestOr404(req.params.id, res);
    if (!returnRequest) return;
    return res.status(200).json(returnRequest);
  } catch (error) {
    return sendServerError(res, "Failed to fetch return request", error);
  }
};

const updateReturnRequest = async (req, res) => {
  try {
    const returnRequest = await findReturnRequestOr404(req.params.id, res);
    if (!returnRequest) return;

    const { orderId, userId, reason, status } = req.body;
    const payload = { orderId, userId, reason, status };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await returnRequest.update(updates);
    return res.status(200).json(returnRequest);
  } catch (error) {
    return sendServerError(res, "Failed to update return request", error, 400);
  }
};

const deleteReturnRequest = async (req, res) => {
  try {
    const returnRequest = await findReturnRequestOr404(req.params.id, res);
    if (!returnRequest) return;

    await returnRequest.destroy();
    return res
      .status(200)
      .json({ message: "Return request deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete return request", error);
  }
};

module.exports = {
  createReturnRequest,
  getReturnRequests,
  getReturnRequestById,
  updateReturnRequest,
  deleteReturnRequest,
};
