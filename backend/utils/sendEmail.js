// utils/sendEmail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("🚀 RESEND_API_KEY loaded:", !!process.env.RESEND_API_KEY);

/**
 * Send an email via Resend
 * @param {string} to - Recipient email
 * @param {string} subject - Subject line
 * @param {string} html - HTML content
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: "admin@muzamilafey.digital",
      to,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, ""), // plain text fallback
    });

    console.log(`✅ Email sent to ${to} with subject "${subject}"`);
    return response;
  } catch (error) {
    console.error("❌ Resend email error:", error.message || error);
    throw new Error("Failed to send email");
  }
};
