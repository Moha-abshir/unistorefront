const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const { isAdmin } = require('../middleware/authMiddleware');

// Create delivery agent (Admin only)
router.post('/agents', isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Agent with email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = new User({
      name,
      email,
      password: hashedPassword,
      role: 'agent',
    });

    await agent.save();
    res.status(201).json({ message: 'Agent created', agentId: agent._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// List all delivery agents (Admin only)
router.get('/agents', isAdmin, async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign order to agent (Admin only)
router.put('/orders/:orderId/assign-agent', isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { agentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const agent = await User.findOne({ _id: agentId, role: 'agent' });
    if (!agent) return res.status(400).json({ message: 'Invalid agent' });

    order.deliveryAgent = agent._id;
    order.deliveryStatus = 'Assigned';
    await order.save();

    res.json({ message: 'Order assigned to agent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders assigned to agents (Admin view)
router.get('/orders/assigned', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ deliveryAgent: { $ne: null } })
      .populate('deliveryAgent', 'name email')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;