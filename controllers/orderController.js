const Order = require("../models/order");
const Product = require("../models/product");
const sequelize = require("../config/db");

const sendServerError = (res, message, error, status = 500) =>
  res.status(status).json({ message, error: error.message });

const orderInclude = [{ model: Product, as: "product" }];

const findOrderOr404 = async (id, res, options = {}) => {
  const order = await Order.findByPk(id, options);
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return null;
  }
  return order;
};

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { productId, quantity, status } = req.body;

    const product = await Product.findByPk(productId, {
      transaction,
      lock: true,
    });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      await transaction.rollback();
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Store total at order-time price to keep a purchase snapshot.
    const totalPrice = Number(product.price) * Number(quantity);
    const order = await Order.create(
      { productId, quantity, totalPrice, status },
      { transaction },
    );

    await product.update({ stock: product.stock - quantity }, { transaction });
    await transaction.commit();

    return res.status(201).json(order);
  } catch (error) {
    await transaction.rollback();
    return sendServerError(res, "Failed to create order", error, 400);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: orderInclude });
    return res.status(200).json(orders);
  } catch (error) {
    return sendServerError(res, "Failed to fetch orders", error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await findOrderOr404(req.params.id, res, {
      include: orderInclude,
    });
    if (!order) return;
    return res.status(200).json(order);
  } catch (error) {
    return sendServerError(res, "Failed to fetch order", error);
  }
};

const updateOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await findOrderOr404(req.params.id, res, {
      transaction,
      lock: true,
    });
    if (!order) {
      await transaction.rollback();
      return;
    }

    const { quantity, status } = req.body;
    let nextQuantity = order.quantity;
    let updatedTotal = Number(order.totalPrice);

    if (quantity !== undefined) {
      const product = await Product.findByPk(order.productId, {
        transaction,
        lock: true,
      });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: "Related product not found" });
      }

      const quantityDelta = Number(quantity) - Number(order.quantity);
      if (quantityDelta > 0 && product.stock < quantityDelta) {
        await transaction.rollback();
        return res.status(400).json({ message: "Not enough stock available" });
      }

      // When quantity goes up, reduce stock. When it goes down, return stock.
      await product.update(
        { stock: product.stock - quantityDelta },
        { transaction },
      );

      nextQuantity = Number(quantity);
      updatedTotal = Number(product.price) * nextQuantity;
    }

    await order.update(
      {
        quantity: nextQuantity,
        status: status || order.status,
        totalPrice: updatedTotal,
      },
      { transaction },
    );

    await transaction.commit();

    return res.status(200).json(order);
  } catch (error) {
    await transaction.rollback();
    return sendServerError(res, "Failed to update order", error, 400);
  }
};

const deleteOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await findOrderOr404(req.params.id, res, {
      transaction,
      lock: true,
    });
    if (!order) {
      await transaction.rollback();
      return;
    }

    const product = await Product.findByPk(order.productId, {
      transaction,
      lock: true,
    });
    if (product) {
      // Return quantity to stock when an order is removed.
      await product.update(
        { stock: product.stock + order.quantity },
        { transaction },
      );
    }

    await order.destroy({ transaction });
    await transaction.commit();
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    return sendServerError(res, "Failed to delete order", error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
