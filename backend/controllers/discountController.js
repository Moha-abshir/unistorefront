import Discount from '../models/Discount.js';
import Product from '../models/product.js';

// Create new discount (admin)
export const createDiscount = async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all discounts
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().populate('product', 'name price');
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get active discounts (for users)
export const getActiveDiscounts = async (req, res) => {
  try {
    const now = new Date();
    const discounts = await Discount.find({
      active: true,
      startsAt: { $lte: now },
      $or: [{ endsAt: null }, { endsAt: { $gte: now } }],
    }).populate('product', 'name price');
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update discount (admin)
export const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!discount) return res.status(404).json({ message: 'Discount not found' });
    res.json(discount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete discount
export const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ message: 'Discount not found' });
    res.json({ message: 'Discount removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
