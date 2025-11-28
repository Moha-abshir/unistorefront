import express from 'express';
import { 
    initiatePesapalPayment, 
    handlePesapalCallback,
    getTransactionStatus
} from '../controllers/pesapalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initiate-payment', protect, initiatePesapalPayment);
router.get('/callback', handlePesapalCallback);
router.get('/status/:orderTrackingId', protect, getTransactionStatus);

export default router;