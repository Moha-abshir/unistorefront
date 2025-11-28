import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order.js';

// Log Pesapal environment variables
console.log("PESAPAL_BASE_URL:", process.env.PESAPAL_BASE_URL);
console.log("PESAPAL_CONSUMER_KEY:", process.env.PESAPAL_CONSUMER_KEY);
console.log("PESAPAL_CONSUMER_SECRET:", process.env.PESAPAL_CONSUMER_SECRET);
console.log("PESAPAL_CALLBACK_URL:", process.env.PESAPAL_CALLBACK_URL);

const getPesapalToken = async () => {
    try {
        const tokenResponse = await axios.post(
            `${process.env.PESAPAL_BASE_URL}/api/Auth/RequestToken`,
            {
                consumer_key: process.env.PESAPAL_CONSUMER_KEY,
                consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
            },
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }
        );
        return tokenResponse.data.token;
    } catch (error) {
        console.error("❌ Pesapal Get Token Error:", error.response?.data || error.message);
        throw new Error("Failed to get Pesapal token");
    }
};

export const initiatePesapalPayment = async (req, res) => {
    try {
        const { amount, email, phone, orderId } = req.body;
        const token = await getPesapalToken();
        console.log("✅ Pesapal Token:", token);

        const ipnRegistrationResponse = await axios.post(
            `${process.env.PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`,
            {
                url: process.env.PESAPAL_CALLBACK_URL,
                ipn_notification_type: "GET"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const ipn_id = ipnRegistrationResponse.data.ipn_id;

        const orderRequest = {
            id: orderId,
            currency: 'KES',
            amount: amount,
            description: 'E-commerce Order Payment',
            callback_url: process.env.PESAPAL_CALLBACK_URL + `?orderId=${orderId}`,
            notification_id: ipn_id,
            billing_address: {
                email_address: email,
                phone_number: phone,
            },
        };

        const orderResponse = await axios.post(
            `${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
            orderRequest,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Pesapal Order Response:", orderResponse.data);
        res.json(orderResponse.data);
    } catch (error) {
        console.error("❌ Pesapal Error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Payment initiation failed",
            error: error.response?.data || error.message,
        });
    }
};

export const handlePesapalCallback = async (req, res) => {
    console.log("📩 Pesapal Callback Received:", req.query);
    const { OrderMerchantReference, OrderTrackingId } = req.query;

    try {
        const token = await getPesapalToken();
        const statusResponse = await axios.get(
            `${process.env.PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const { status_code } = statusResponse.data;

        const newStatus = status_code === 1 ? 'Processing' : 'Failed';

        await Order.findByIdAndUpdate(OrderMerchantReference, { status: newStatus });

        res.redirect(`/order-confirmation?orderId=${OrderMerchantReference}`);

    } catch (error) {
        console.error("❌ Pesapal Callback Error:", error.response?.data || error.message);
        res.redirect(`/payment-failed?orderId=${OrderMerchantReference}`);
    }
};

export const getTransactionStatus = async (req, res) => {
    try {
        const { orderTrackingId } = req.params;
        const token = await getPesapalToken();

        const statusResponse = await axios.get(
            `${process.env.PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        res.json(statusResponse.data);

    } catch (error) {
        console.error("❌ Pesapal Get Status Error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to get transaction status",
            error: error.response?.data || error.message,
        });
    }
};