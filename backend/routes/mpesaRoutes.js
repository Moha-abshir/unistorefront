import express from "express";
import axios from "axios";
import dotenv from "dotenv";


import { initiateStkPush, handleCallback } from "../controllers/mpesaController.js";
dotenv.config();
const router = express.Router();

// 
router.post("/stkpush", initiateStkPush);
router.post("/callback", handleCallback);
// Generate Access Token
const generateAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const response = await axios.get(
      `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error generating access token:", error.response?.data || error.message);
    throw error;
  }
};

// STK Push Route
router.post("/stkpush", async (req, res) => {
  const { phone, amount } = req.body;
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .substring(0, 14); // e.g. 20251012170000
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  try {
    const accessToken = await generateAccessToken();

    const response = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "EcommerceTest",
        TransactionDesc: "Testing Daraja STK Push"
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    res.json({
      success: true,
      message: "STK Push initiated successfully",
      data: response.data
    });
  } catch (error) {
    console.error("STK Push error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "STK Push failed",
      error: error.response?.data || error.message
    });
  }
});

export default router;
