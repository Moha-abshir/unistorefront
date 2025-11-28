import express from 'express';
import {
  createDiscount,
  getAllDiscounts,
  getActiveDiscounts,
  updateDiscount,
  deleteDiscount,
} from '../controllers/discountController.js';

const router = express.Router();

// Admin routes
router.post('/discount', createDiscount);        // matches POST /api/discounts/discount
router.get('/discounts', getAllDiscounts);       // matches GET /api/discounts/discounts
router.put('/discount/:id', updateDiscount);
router.delete('/discount/:id', deleteDiscount);

// Public route — fetch active discounts
router.get('/active/list', getActiveDiscounts);

export default router;
