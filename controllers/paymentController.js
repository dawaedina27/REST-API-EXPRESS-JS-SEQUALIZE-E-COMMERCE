const Payment = require("../models/payment");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const findPaymentOr404 = async (id, res) => {
  const payment = await Payment.findByPk(id);
  if (!payment) {
    res.status(404).json({ message: "Payment not found" });
    return null;
  }
  return payment;
};

const createPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, method, status, reference } = req.body;
    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      method,
      status,
      reference,
    });
    return res.status(201).json(payment);
  } catch (error) {
    return sendServerError(res, "Failed to create payment", error, 400);
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    return res.status(200).json(payments);
  } catch (error) {
    return sendServerError(res, "Failed to fetch payments", error);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await findPaymentOr404(req.params.id, res);
    if (!payment) return;
    return res.status(200).json(payment);
  } catch (error) {
    return sendServerError(res, "Failed to fetch payment", error);
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = await findPaymentOr404(req.params.id, res);
    if (!payment) return;

    const { orderId, userId, amount, method, status, reference } = req.body;
    const payload = { orderId, userId, amount, method, status, reference };
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await payment.update(updates);
    return res.status(200).json(payment);
  } catch (error) {
    return sendServerError(res, "Failed to update payment", error, 400);
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await findPaymentOr404(req.params.id, res);
    if (!payment) return;

    await payment.destroy();
    return res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Failed to delete payment", error);
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
