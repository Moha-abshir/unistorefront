import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order.js';
import Product from '../models/product.js';

// Normalize PESAPAL base URL to support sandbox or production
const rawBase = process.env.PESAPAL_BASE_URL || 'https://cybqa.pesapal.com/pesapalv3';
let PESAPAL_BASE = rawBase.replace(/\/+$/g, '');
if (PESAPAL_BASE.includes('cybqa') && !PESAPAL_BASE.includes('/pesapalv3')) {
    PESAPAL_BASE = PESAPAL_BASE + '/pesapalv3';
}
if (PESAPAL_BASE.includes('pay.pesapal.com') && !PESAPAL_BASE.includes('/v3')) {
    PESAPAL_BASE = PESAPAL_BASE + '/v3';
}

// Log Pesapal environment variables (sanitized)
console.log('PESAPAL_BASE:', PESAPAL_BASE);
console.log('PESAPAL_CALLBACK_URL:', process.env.PESAPAL_CALLBACK_URL);

const getPesapalToken = async () => {
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        const msg = 'Missing PESAPAL_CONSUMER_KEY or PESAPAL_CONSUMER_SECRET in environment';
        console.error('❌', msg);
        throw new Error(msg);
    }

    try {
        const tokenResponse = await axios.post(
            `${PESAPAL_BASE}/api/Auth/RequestToken`,
            {
                consumer_key: consumerKey,
                consumer_secret: consumerSecret,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );

        // token may be nested depending on API response
        return tokenResponse.data?.token || tokenResponse.data?.data || tokenResponse.data;
    } catch (error) {
        console.error('❌ Pesapal Get Token Error:', error.response?.data || error.message);
        throw new Error('Failed to get Pesapal token');
    }
};

export const initiatePesapalPayment = async (req, res) => {
    try {
        const { amount, email, phone, orderId } = req.body;
        const token = await getPesapalToken();
        console.log('✅ Pesapal Token:', token);

        // Register IPN (notification) if callback provided
        let ipn_id = process.env.PESAPAL_IPN_ID;
        try {
            const ipnRegistrationResponse = await axios.post(
                `${PESAPAL_BASE}/api/URLSetup/RegisterIPN`,
                {
                    url: process.env.PESAPAL_CALLBACK_URL,
                    ipn_notification_type: 'GET',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            ipn_id = ipnRegistrationResponse.data?.ipn_id || ipnRegistrationResponse.data?.notification_id || ipn_id;
        } catch (ipnErr) {
            console.warn('⚠️ IPN registration failed (continuing):', ipnErr.response?.data || ipnErr.message);
        }

        const orderRequest = {
            id: orderId,
            currency: 'KES',
            amount: amount,
            description: 'E-commerce Order Payment',
            callback_url: (process.env.PESAPAL_CALLBACK_URL || '') + `?orderId=${orderId}`,
            notification_id: ipn_id,
            billing_address: {
                email_address: email,
                phone_number: phone,
            },
        };

        const orderResponse = await axios.post(
            `${PESAPAL_BASE}/api/Transactions/SubmitOrderRequest`,
            orderRequest,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log('✅ Pesapal Order Response:', orderResponse.data);
        // normalize response to include redirect_url and order_tracking_id for frontend
        const resp = orderResponse.data;
        const normalized = {
            redirect_url: resp.redirect_url || resp.redirectUrl || resp.data?.redirect_url,
            order_tracking_id: resp.order_tracking_id || resp.orderTrackingId || resp.data?.order_tracking_id,
            raw: resp,
        };
        res.json(normalized);
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
            `${PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const { status_code } = statusResponse.data;

        const newStatus = status_code === 1 ? 'Processing' : 'Failed';

        // If payment succeeded, decrement product stock now (we deferred on order creation)
        if (newStatus === 'Processing') {
            const order = await Order.findById(OrderMerchantReference);
            if (order && order.paymentMethod === 'Pesapal' && order.status !== 'Processing') {
                // decrement each product's stock
                for (const item of order.orderItems) {
                    try {
                        const product = await Product.findById(item.product);
                        if (!product) {
                            console.warn(`Product not found when finalizing order: ${item.product}`);
                            continue;
                        }
                        // ensure stock is sufficient (it was validated at order creation)
                        if (item.qty > product.stock) {
                            console.error(`Insufficient stock for product ${product._id} while finalizing Pesapal order ${order._id}`);
                            // mark order failed and stop processing
                            await Order.findByIdAndUpdate(order._id, { status: 'Failed' });
                            return res.redirect(`/payment-failed?orderId=${order._id}`);
                        }
                        product.stock -= item.qty;
                        await product.save();
                    } catch (pErr) {
                        console.error('Error decrementing product stock after Pesapal success:', pErr.message);
                    }
                }
            }
        }

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