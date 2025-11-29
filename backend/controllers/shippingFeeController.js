import ShippingFee from '../models/ShippingFee.js';

// Get current shipping fee
export const getShippingFee = async (req, res) => {
  try {
    let shippingFee = await ShippingFee.findOne();
    if (!shippingFee) {
      // Create default if none exists
      shippingFee = new ShippingFee({ amount: 0, description: 'Standard Shipping Fee' });
      await shippingFee.save();
    }
    res.json(shippingFee);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get shipping fee', error: err.message });
  }
};

// Get all shipping fees (admin)
export const getAdminShippingFees = async (req, res) => {
  try {
    const fees = await ShippingFee.find();
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get shipping fees', error: err.message });
  }
};

// Create or update shipping fee (admin)
export const createShippingFee = async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Check if fee exists; if not create it
    let shippingFee = await ShippingFee.findOne();
    if (!shippingFee) {
      shippingFee = new ShippingFee({ amount, description: description || 'Standard Shipping Fee' });
    } else {
      shippingFee.amount = amount;
      if (description) shippingFee.description = description;
    }

    await shippingFee.save();
    res.json(shippingFee);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create/update shipping fee', error: err.message });
  }
};

// Update shipping fee (admin)
export const updateShippingFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    const shippingFee = await ShippingFee.findByIdAndUpdate(
      id,
      { amount, description },
      { new: true }
    );

    if (!shippingFee) {
      return res.status(404).json({ message: 'Shipping fee not found' });
    }

    res.json(shippingFee);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update shipping fee', error: err.message });
  }
};

// Delete shipping fee (admin)
export const deleteShippingFee = async (req, res) => {
  try {
    const { id } = req.params;

    const shippingFee = await ShippingFee.findByIdAndDelete(id);
    if (!shippingFee) {
      return res.status(404).json({ message: 'Shipping fee not found' });
    }

    res.json({ message: 'Shipping fee deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete shipping fee', error: err.message });
  }
};
