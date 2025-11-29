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

// Admin categories (managed list)
import { getAdminCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
router.get('/categories', protect, admin, getAdminCategories);
router.post('/categories', protect, admin, createCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

// Shipping Fee endpoints
import { getShippingFee, getAdminShippingFees, createShippingFee, updateShippingFee, deleteShippingFee } from '../controllers/shippingFeeController.js';
router.get('/shipping-fees', getShippingFee); // public: get current fee
router.get('/shipping-fees/admin/list', protect, admin, getAdminShippingFees);
router.post('/shipping-fees', protect, admin, createShippingFee);
router.patch('/shipping-fees/:id', protect, admin, updateShippingFee);
router.delete('/shipping-fees/:id', protect, admin, deleteShippingFee);

export default router;