#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

const usage = () => {
  console.log('Usage: node scripts/resendVerification.js <email>');
};

const main = async () => {
  const email = process.argv[2];
  if (!email) {
    usage();
    process.exit(1);
  }

  await connectDB();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      process.exit(1);
    }

    if (user.isEmailVerified) {
      console.log('Email already verified for:', email);
      process.exit(0);
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpire = verificationTokenExpire;
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const html = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f7f8fa; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 25px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 22px;">✉️ Verify Your Email</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hello <b>${user.name || 'User'}</b>,</p>
            <p style="font-size: 15px; line-height: 1.6;">Please verify your email address by clicking the button below.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                style="background: linear-gradient(135deg, #28a745, #20c997); color: #fff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600;">
                Verify Email Address
              </a>
            </div>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">Or copy and paste this link in your browser:<br>
              <a href="${verificationUrl}" style="color: #007bff; text-decoration: none; word-break: break-all;">${verificationUrl}</a>
            </p>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">This link will expire in <b>24 hours</b> for your security.</p>
          </div>
        </div>
      </div>
    `;

    await sendEmail(email, 'Verify Your Email Address', html);
    console.log('Verification email resent to:', email);
    process.exit(0);
  } catch (error) {
    console.error('Error resending verification:', error.message || error);
    process.exit(1);
  }
};

main();
