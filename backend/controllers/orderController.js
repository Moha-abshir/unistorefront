import Order from '../models/Order.js';
import Product from '../models/product.js';
import Coupon from '../models/Coupon.js';

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

    // Process each order item: check stock & reduce
    const processedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.product}` });

      if (item.qty > product.stock)
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });

      product.stock -= item.qty;
      await product.save();

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
