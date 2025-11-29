import Order from '../models/Order.js';
import Product from '../models/product.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import Transaction from '../models/Transaction.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      discount = { type: null, value: 0 },
      couponCode = null,
      finalAmount,
      phone,
    } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: 'No order items provided' });

    // Process each order item: check stock. For online payments like Pesapal/Mpesa
    // do not decrement stock here — we'll reserve on successful payment in the callback.
    const processedItems = [];
    const shouldReserveNow = !(paymentMethod === 'Pesapal' || paymentMethod === 'Mpesa');
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.product}` });

      if (item.qty > product.stock)
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });

      if (shouldReserveNow) {
        product.stock -= item.qty;
        await product.save();
      }

      processedItems.push({
        product: product._id,
        qty: item.qty,
        price: product.price,
      });
    }

    // Optional: validate coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (!coupon)
        return res.status(400).json({ message: 'Invalid or inactive coupon' });

      const now = new Date();
      if (coupon.expiresAt && coupon.expiresAt < now)
        return res.status(400).json({ message: 'Coupon has expired' });

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses)
        return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: processedItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      discountType: discount?.type || null,
      discountValue: discount?.value || 0,
      couponCode: couponCode || null,
      finalAmount,
      status: paymentMethod === 'Pesapal' || paymentMethod === 'Mpesa' ? 'Pending' : 'Processing',
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order', error: error.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phoneNumber')
      .populate('orderItems.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phoneNumber')
      .populate('orderItems.product', 'name price');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Get orders of logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your orders', error: error.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Admin: send payment reminder to customer for unpaid orders
export const sendPaymentReminder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const frontend = process.env.FRONTEND_URL || 'https://muzafey.online';
    const payLink = `${frontend}/order-confirmation?orderId=${order._id}`;

    const subject = `Payment reminder for order ${order.orderId || order._id}`;
    const html = `
      <p>Hi ${order.user?.name || 'Customer'},</p>
      <p>This is a reminder to complete payment for your order <strong>${order.orderId || order._id}</strong>.</p>
      <p>Amount due: <strong>KES ${(order.finalAmount || order.totalPrice).toFixed(2)}</strong></p>
      <p>Please complete payment here: <a href="${payLink}">Complete payment</a></p>
      <p>If you've already paid, please ignore this message.</p>
    `;

    try {
      if (order.user?.email) {
        await sendEmail(order.user.email, subject, html);
      }
    } catch (emailErr) {
      console.error('Failed to send payment reminder email:', emailErr.message || emailErr);
      // Do not fail the whole request if email failed
    }

    res.json({ message: 'Payment reminder sent' });
  } catch (error) {
    console.error('Error sending payment reminder:', error.message || error);
    res.status(500).json({ message: 'Failed to send payment reminder' });
  }
};

// Admin: update payment status (mark Paid/Unpaid)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!['Paid', 'Unpaid'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If marking Paid and order was unpaid, finalize stock and create transaction
    if (paymentStatus === 'Paid' && order.paymentStatus !== 'Paid') {
      // Decrement stock (if not already processed)
      for (const item of order.orderItems) {
        try {
          const product = await Product.findById(item.product);
          if (!product) continue;
          if (item.qty > product.stock) {
            console.warn(`Insufficient stock while marking order paid: ${product._id}`);
            // continue without failing; admin should handle stock shortages
          } else {
            product.stock -= item.qty;
            await product.save();
          }
        } catch (pErr) {
          console.error('Error decrementing stock while marking paid:', pErr.message || pErr);
        }
      }

      order.paymentStatus = 'Paid';
      order.status = order.status === 'Pending' ? 'Processing' : order.status;
      await order.save();

      // Record transaction (admin-marked)
      try {
        const tx = new Transaction({
          user: order.user,
          mpesaReceiptNumber: null,
          phoneNumber: order.shippingAddress?.phone || undefined,
          amount: order.finalAmount || order.totalPrice || 0,
          status: 'AdminMarkedPaid',
          rawResponse: { note: 'Marked Paid by admin' },
        });
        await tx.save();
      } catch (txErr) {
        console.error('Failed to record admin-marked transaction:', txErr.message || txErr);
      }

      return res.json({ message: 'Order marked as Paid', order });
    }

    // If marking Unpaid
    if (paymentStatus === 'Unpaid') {
      order.paymentStatus = 'Unpaid';
      await order.save();
      return res.json({ message: 'Order marked as Unpaid', order });
    }

    res.json({ message: 'No change' });
  } catch (error) {
    console.error('Error updating payment status:', error.message || error);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};

// Delete an order (admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If order not delivered or shipped, restore product stock
    if (!['Delivered', 'Shipped'].includes(order.status)) {
      for (const item of order.orderItems) {
        try {
          const product = await Product.findById(item.product);
          if (!product) continue;
          product.stock = (product.stock || 0) + (item.qty || 0);
          await product.save();
        } catch (pErr) {
          console.error('Error restoring product stock on order delete:', pErr.message);
        }
      }
    }

    await Order.findByIdAndDelete(order._id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Delete order error:', error.message);
    res.status(500).json({ message: 'Server error deleting order', error: error.message });
  }
};
