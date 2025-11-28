import express from 'express';
import { createContactMessage, getAllMessages } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', protect, admin, getAllMessages);

export default router;
