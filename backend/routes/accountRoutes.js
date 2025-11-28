import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  changePassword,
  requestPasswordReset,
  resetPassword,
  activateAccount,
  sendActivationEmail,
  activateAccountByToken
} from '../controllers/accountController.js';

const router = express.Router();

// Change password (user)
router.post('/change-password', protect, changePassword);
// Request password reset (public)
router.post('/request-reset', requestPasswordReset);
// Reset password (public)
router.post('/reset-password', resetPassword);
// Activate account (admin)
router.patch('/activate/:id', protect, admin, activateAccount);
// Send activation email (public)
router.post('/send-activation', sendActivationEmail);
// Activate account via token (public)
router.post('/activate-by-token', activateAccountByToken);

export default router;
