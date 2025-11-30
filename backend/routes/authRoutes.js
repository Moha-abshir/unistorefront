import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  verifyEmailRedirect,
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
// Allow GET requests from email clients to verify and then redirect to frontend
router.get("/verify-email/:token", verifyEmailRedirect || verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
// Convenience GET route for quick resend via URL (careful: exposes email in URL)
router.get("/resend-verification-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    // reuse controller logic
    // call the controller function which expects req.body.email — adapt via req.body override
    req.body = { email };
    await resendVerificationEmail(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to resend verification email', error: error.message });
  }
});
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
