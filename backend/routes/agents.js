const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isAgent } = require('../middleware/authMiddleware');

// Get orders assigned to logged-in agent
router.get('/orders', isAgent, async (req, res) => {
  try {
    const orders = await Order.find({ deliveryAgent: req.user._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Agent marks order as delivered
router.put('/orders/:orderId/delivered', isAgent, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      deliveryAgent: req.user._id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });

    order.deliveryStatus = 'Delivered';
    order.status = 'Delivered'; // update main order status also
    await order.save();

    res.json({ message: 'Order marked as delivered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;