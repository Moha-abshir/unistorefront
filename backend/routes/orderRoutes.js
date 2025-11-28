import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, admin, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
