import express from 'express';
import { getAdminStats, getDiscountedCarousel, setDiscountedCarousel } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.get('/dashboard-data', getAdminStats);

// ✅ Discount Carousel endpoints
router.get('/discounted-carousel', getDiscountedCarousel);
router.post('/discounted-carousel', protect, admin, setDiscountedCarousel);

// Transactions
import { getAllTransactions, getTransactionById } from '../controllers/transactionController.js';
router.get('/transactions', protect, admin, getAllTransactions);
router.get('/transactions/:id', protect, admin, getTransactionById);

export default router;