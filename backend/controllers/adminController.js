import Order from '../models/Order.js';
import Product from '../models/product.js';
import User from '../models/User.js';
import CarouselSetting from '../models/CarouselSetting.js';


export const getAdminStats = async (req, res) => {
  try {
    // Orders
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalOrders = orders.length;
    const newOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;

    // Products
    const products = await Product.find();
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    // Customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    // Agents
    const totalAgents = 0;

    // Revenue
    let paidRevenue = 0;
    let unpaidRevenue = 0;
    orders.forEach(order => {
      if (order.paymentMethod === 'Pay on Delivery' && order.status !== 'Completed') {
        unpaidRevenue += order.totalPrice || 0;
      } else {
        paidRevenue += order.totalPrice || 0;
      }
    });
    const totalRevenue = paidRevenue + unpaidRevenue;

    // Stock graph (sold and unpaid)
    const stockGraph = [];
    products.forEach(product => {
      let sold = 0;
      let unpaid = 0;
      orders.forEach(order => {
        order.orderItems.forEach(item => {
          if (String(item.product) === String(product._id)) {
            sold += item.qty;
            if (order.paymentMethod === 'Pay on Delivery' && order.status !== 'Completed') {
              unpaid += item.qty;
            }
          }
        });
      });
      stockGraph.push({ name: product.name, sold, unpaid });
    });

    res.json({
      totalOrders,
      newOrders,
      completedOrders,
      totalProducts,
      totalStock,
      totalRevenue,
      paidRevenue,
      unpaidRevenue,
      totalCustomers,
      totalAgents,
      stockGraph,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
  }
};

// ✅ Get discounted carousel products (up to 3)
export const getDiscountedCarousel = async (req, res) => {
  try {
    let setting = await CarouselSetting.findOne().populate('productIds');
    if (!setting || !setting.productIds || setting.productIds.length === 0) {
      return res.json([]);
    }

    // compute discountedPrice for each product using setting.discountPercent
    const percent = Number(setting.discountPercent) || 0;
    const products = setting.productIds.map((p) => {
      const price = Number(p.price || 0);
      const discountedPrice = Math.max(0, price - (price * percent) / 100);
      return {
        ...p.toObject(),
        discountedPrice,
      };
    });
    res.json({ products, discountPercent: percent });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching carousel', error: error.message });
  }
};

// ✅ Set discounted carousel products (admin only, unlimited)
export const setDiscountedCarousel = async (req, res) => {
  try {
    const { productIds, discountPercent } = req.body;
    
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ message: 'productIds must be an array' });
    }

    // Validate product IDs exist
    for (const id of productIds) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(400).json({ message: `Product ${id} not found` });
      }
    }

    let setting = await CarouselSetting.findOne();
    if (!setting) {
      setting = new CarouselSetting({ productIds, discountPercent: Number(discountPercent) || 0 });
    } else {
      setting.productIds = productIds;
      if (typeof discountPercent !== 'undefined') setting.discountPercent = Number(discountPercent) || 0;
      setting.updatedAt = Date.now();
    }

    await setting.save();
    const populated = await setting.populate('productIds');
    // return products with computed discountedPrice and the discountPercent
    const percent = Number(populated.discountPercent) || 0;
    const products = populated.productIds.map((p) => {
      const price = Number(p.price || 0);
      const discountedPrice = Math.max(0, price - (price * percent) / 100);
      return {
        ...p.toObject(),
        discountedPrice,
      };
    });
    res.json({ products, discountPercent: percent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating carousel', error: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

// ✅ Get list of unverified customers
export const getUnverifiedCustomers = async (req, res) => {
  try {
    const unverifiedUsers = await User.find(
      { isEmailVerified: false },
      { _id: 1, name: 1, email: 1, createdAt: 1, verificationToken: 1 }
    ).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: unverifiedUsers.length,
      users: unverifiedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unverified customers',
      error: error.message,
    });
  }
};

// ✅ Admin verifies a customer email
export const verifyCustomerEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isEmailVerified: true,
        verificationToken: undefined,
        verificationTokenExpire: undefined,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      message: `Customer ${user.email} verified successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying customer',
      error: error.message,
    });
  }
};