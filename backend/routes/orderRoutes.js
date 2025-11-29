import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  sendPaymentReminder,
  updatePaymentStatus,
  getReminderMessages,
  markReminderAsRead,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/reminders/all', protect, getReminderMessages);
router.put('/reminders/mark-read', protect, markReminderAsRead);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/payment-status', protect, admin, updatePaymentStatus);
router.post('/:id/send-payment-reminder', protect, admin, sendPaymentReminder);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
