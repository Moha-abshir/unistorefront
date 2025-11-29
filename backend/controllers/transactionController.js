import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// Admin: get all transactions with user info
export const getAllTransactions = async (req, res) => {
  try {
    // only non-deleted transactions
    const transactions = await Transaction.find({ isDeleted: { $ne: true } })
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

// Admin: soft-delete a transaction (move to trash)
export const softDeleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    tx.isDeleted = true;
    tx.deletedAt = new Date();
    await tx.save();
    res.json({ message: 'Transaction moved to trash' });
  } catch (error) {
    console.error('Error deleting transaction:', error.message || error);
    res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
  }
};

// Admin: restore a soft-deleted transaction
export const restoreTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    tx.isDeleted = false;
    tx.deletedAt = null;
    await tx.save();
    res.json({ message: 'Transaction restored' });
  } catch (error) {
    console.error('Error restoring transaction:', error.message || error);
    res.status(500).json({ message: 'Failed to restore transaction', error: error.message });
  }
};

// Admin: permanently delete a transaction
export const hardDeleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    await Transaction.deleteOne({ _id: req.params.id });
    res.json({ message: 'Transaction permanently deleted' });
  } catch (error) {
    console.error('Error permanently deleting transaction:', error.message || error);
    res.status(500).json({ message: 'Failed to permanently delete transaction', error: error.message });
  }
};

// Admin: list trashed transactions
export const getTrashedTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ isDeleted: true })
      .populate('user', 'name email phone')
      .sort({ deletedAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching trashed transactions:', error.message || error);
    res.status(500).json({ message: 'Failed to fetch trashed transactions', error: error.message });
  }
};
