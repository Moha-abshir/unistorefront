import axios from "axios";
import moment from "moment";

export const initiateStkPush = async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !/^(07|01)\d{8}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid M-PESA number" });
    }

    // Your Safaricom Daraja Sandbox credentials
    const consumerKey = process.env.MPESA_CONSUMER_KEY || "";
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
    const shortcode = "174379";
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

    // 1️⃣ Get Access Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const { data: tokenResponse } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const accessToken = tokenResponse.access_token;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // 2️⃣ Initiate STK Push
    const { data: stkResponse } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: `${process.env.MPESA_BASE_URL || "https://manwellback.onrender.com"}/api/mpesa/callback`,
        AccountReference: "ManderaSoftwares",
        TransactionDesc: "Order Payment",
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log("✅ STK Push sent successfully:", stkResponse);
    res.json({ message: "STK Push sent. Complete the payment on your phone!" });
  } catch (error) {
    console.error("❌ STK Push error:", error.response?.data || error.message);
    res.status(500).json({
      message: "M-PESA STK Push failed",
      error: error.response?.data || error.message,
    });
  }
};

// STK Push Callback Endpoint (for testing)
export const handleCallback = (req, res) => {
  console.log("📥 M-PESA CALLBACK RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));
  res.json({ ResultCode: 0, ResultDesc: "Callback received successfully" });
};
