import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// Admin: get all transactions with user info
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message || error);
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

// Admin: get single transaction by id
export const getTransactionById = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id).populate('user', 'name email phone');
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    res.json(tx);
  } catch (error) {
    console.error('Error fetching transaction:', error.message || error);
    res.status(500).json({ message: 'Failed to fetch transaction', error: error.message });
  }
};
