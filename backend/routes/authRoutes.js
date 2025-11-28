import express from "express";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
