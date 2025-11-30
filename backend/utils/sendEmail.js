// utils/sendEmail.js
import { Resend } from "resend";
import createTransporter from "../config/email.js";

console.log("🚀 Email helper initialized. RESEND configured:", !!process.env.RESEND_API_KEY);

/**
 * Send an email using Resend (preferred) with Nodemailer fallback.
 * @param {string} to - Recipient email
 * @param {string} subject - Subject line
 * @param {string} html - HTML content
 */
export const sendEmail = async (to, subject, html) => {
  const text = html.replace(/<[^>]+>/g, ""); // plain text fallback

  // Try Resend if API key is provided
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const response = await resend.emails.send({
        from: process.env.EMAIL_FROM || "admin@muzamilafey.digital",
        to,
        subject,
        html,
        text,
      });

      console.log(`✅ Resend: Email sent to ${to} with subject "${subject}"`);
      return response;
    } catch (resendError) {
      console.error("❌ Resend email error:", resendError && resendError.message ? resendError.message : resendError);
      // fall through to try Nodemailer
    }
  }

  // Nodemailer fallback (requires SMTP env vars configured)
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || "no-reply@localhost",
      to,
      subject,
      html,
      text,
    });

    console.log(`✅ SMTP: Email sent to ${to} with subject "${subject}" (messageId: ${info.messageId})`);
    return info;
  } catch (smtpError) {
    console.error("❌ SMTP email error:", smtpError && smtpError.message ? smtpError.message : smtpError);
    throw new Error("Failed to send email via Resend and SMTP fallback");
  }
};
