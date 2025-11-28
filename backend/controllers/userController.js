import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ========================== AUTH & PROFILE ==========================

// @desc Register new user
// @route POST /api/users/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// @desc Login user
// @route POST /api/users/login
// @access Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.postalCode = req.body.postalCode || user.postalCode;
    user.country = req.body.country || user.country;

    if (req.body.password) user.password = req.body.password;

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// ========================== ADMIN CONTROLS ==========================

// @desc Get all customers
// @route GET /api/users/customers
// @access Admin
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: { $in: ['user', 'customer'] } }).select('-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// @desc Verify a customer by admin
// @route PUT /api/users/customers/:id/verify
// @access Admin
export const verifyCustomerByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'user' && user.role !== 'customer')
      return res.status(400).json({ message: 'Only user/customer accounts can be verified' });

    if (user.isVerified)
      return res.status(400).json({ message: 'Customer is already verified' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Customer verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying customer', error: error.message });
  }
};

// @desc Delete a customer (admin only)
export const deleteCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};

// @desc Deactivate a customer (admin only)
export const deactivateCustomer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'customer')
      return res.status(400).json({ message: 'Only customers can be deactivated' });

    res.json({ message: 'Customer deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating customer', error: error.message });
  }
};

// @desc Activate a customer (admin only)
export const activateCustomer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'user' && user.role !== 'customer')
      return res.status(400).json({ message: 'Only user/customer accounts can be activated' });

    res.json({ message: 'Customer activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error activating customer', error: error.message });
  }
};

// @desc Promote a user to admin (admin only)
// @route PUT /api/users/:id/make-admin
// @access Admin
export const makeUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'User is already an admin' });

    user.role = 'admin';
    await user.save();

    res.json({ message: 'User promoted to admin successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error promoting user to admin', error: error.message });
  }
};

// @desc Get all saved shipping addresses for user
// @route GET /api/users/addresses
// @access Protected
export const getSavedAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.shippingAddresses || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error: error.message });
  }
};

// @desc Add a new shipping address
// @route POST /api/users/addresses
// @access Protected
export const addSavedAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, postalCode, country, isDefault } = req.body;

    if (!fullName || !phone || !address || !city || !country) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If this is the default, remove default from others
    if (isDefault) {
      user.shippingAddresses.forEach(addr => addr.isDefault = false);
    }

    user.shippingAddresses.push({
      fullName,
      phone,
      address,
      city,
      postalCode,
      country,
      isDefault: isDefault || user.shippingAddresses.length === 0, // First address is default
    });

    await user.save();
    res.status(201).json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};

// @desc Update a saved shipping address
// @route PUT /api/users/addresses/:addressId
// @access Protected
export const updateSavedAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, address, city, postalCode, country, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const savedAddr = user.shippingAddresses.id(addressId);
    if (!savedAddr) return res.status(404).json({ message: 'Address not found' });

    // Update fields
    if (fullName) savedAddr.fullName = fullName;
    if (phone) savedAddr.phone = phone;
    if (address) savedAddr.address = address;
    if (city) savedAddr.city = city;
    if (postalCode) savedAddr.postalCode = postalCode;
    if (country) savedAddr.country = country;

    // If this is being set as default, remove default from others
    if (isDefault) {
      user.shippingAddresses.forEach(addr => addr.isDefault = false);
      savedAddr.isDefault = true;
    }

    await user.save();
    res.json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};

// @desc Delete a saved shipping address
// @route DELETE /api/users/addresses/:addressId
// @access Protected
export const deleteSavedAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.shippingAddresses.id(addressId).deleteOne();
    await user.save();

    res.json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};

// @desc Set a saved address as default
// @route PUT /api/users/addresses/:addressId/set-default
// @access Protected
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove default from all
    user.shippingAddresses.forEach(addr => addr.isDefault = false);

    // Set the selected one as default
    const savedAddr = user.shippingAddresses.id(addressId);
    if (!savedAddr) return res.status(404).json({ message: 'Address not found' });

    savedAddr.isDefault = true;
    await user.save();

    res.json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Error setting default address', error: error.message });
  }
};
