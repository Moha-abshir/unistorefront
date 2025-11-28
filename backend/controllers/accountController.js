import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 🔹 Change user password (logged-in user)
 */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Old and New Password required." });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Error changing password." });
  }
};

/**
 * 🔹 Request password reset (send reset email)
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found." });

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Manwell <no-reply@manwell.app>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password. Click below to proceed:</p>
        <a href="${resetLink}" style="padding:10px 15px;background:#007bff;color:white;border-radius:6px;text-decoration:none;">Reset Password</a>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Password reset email error:", error);
    res.status(500).json({ message: "Failed to send reset email." });
  }
};

/**
 * 🔹 Reset password using token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ message: "Token and new password required." });

    const user = await User.findOne({ verificationToken: token });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
};

/**
 * 🔹 Send account activation email
 */
export const sendActivationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found." });
    if (user.isActive)
      return res.status(400).json({ message: "Account already active." });

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    await user.save();

    const activationLink = `${process.env.CLIENT_URL}/activate-account?token=${token}`;

    await resend.emails.send({
      from: "Manwell <no-reply@manwell.app>",
      to: email,
      subject: "Activate Your Manwell Account",
      html: `
        <h2>Welcome to Manwell!</h2>
        <p>Click below to activate your account:</p>
        <a href="${activationLink}" style="padding:10px 15px;background:#28a745;color:white;border-radius:6px;text-decoration:none;">Activate Account</a>
      `,
    });

    res.status(200).json({ message: "Activation email sent!" });
  } catch (error) {
    console.error("Activation email error:", error);
    res.status(500).json({ message: "Failed to send activation email." });
  }
};

/**
 * 🔹 Activate account using token
 */
export const activateAccountByToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Token required." });

    const user = await User.findOne({ verificationToken: token });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    user.isActive = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Account activated successfully!" });
  } catch (error) {
    console.error("Account activation error:", error);
    res.status(500).json({ message: "Error activating account." });
  }
};

/**
 * 🔹 Admin manual activation (fallback)
 */
export const activateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found." });

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: "Account activated successfully by admin!" });
  } catch (error) {
    console.error("Admin activation error:", error);
    res.status(500).json({ message: "Error activating account." });
  }
};
