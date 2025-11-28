import express from 'express';
import {
  createCoupon,
  getAllCoupons,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

// ✅ Admin routes
router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

// ✅ Public route — validate coupon during checkout (GET)
router.get('/validate/:code', validateCoupon);

export default router;
