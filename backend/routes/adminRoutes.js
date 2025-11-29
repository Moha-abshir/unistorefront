import express from 'express';
import { getAdminStats, getDiscountedCarousel, setDiscountedCarousel } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { setAdminPin, verifyAdminPin, getAdminLockStatus, toggleAppLock } from '../controllers/appLockController.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.get('/dashboard-data', getAdminStats);

// ✅ Discount Carousel endpoints
router.get('/discounted-carousel', getDiscountedCarousel);
router.post('/discounted-carousel', protect, admin, setDiscountedCarousel);

// Transactions
import { getAllTransactions, getTransactionById, softDeleteTransaction, restoreTransaction, hardDeleteTransaction, getTrashedTransactions } from '../controllers/transactionController.js';
router.get('/transactions', protect, admin, getAllTransactions);
router.get('/transactions/trash', protect, admin, getTrashedTransactions);
router.get('/transactions/:id', protect, admin, getTransactionById);
router.delete('/transactions/:id', protect, admin, softDeleteTransaction);
router.put('/transactions/:id/restore', protect, admin, restoreTransaction);
router.delete('/transactions/:id/permanent', protect, admin, hardDeleteTransaction);

// App Lock endpoints
router.post('/applock/set-pin', protect, admin, setAdminPin);
router.post('/applock/verify-pin', protect, admin, verifyAdminPin);
router.get('/applock/status', protect, admin, getAdminLockStatus);
router.put('/applock/toggle', protect, admin, toggleAppLock);

export default router;