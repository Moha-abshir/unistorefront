import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  googleAuthCallback,
  getGoogleUser,
  linkGoogleAccount,
} from "../controllers/authController.js";

const router = express.Router();

// ✅ Local Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

// ✅ Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthCallback
);

router.get("/user/google", getGoogleUser);
router.post("/user/:userId/link-google", linkGoogleAccount);

export default router;
