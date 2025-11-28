import axios from 'axios';

// Normalize base URL (sandbox or production)
const rawBase = process.env.PESAPAL_BASE_URL || 'https://cybqa.pesapal.com/pesapalv3';
let BASE_URL = rawBase.replace(/\/+$/g, '');
if (BASE_URL.includes('cybqa') && !BASE_URL.includes('/pesapalv3')) BASE_URL = BASE_URL + '/pesapalv3';
if (BASE_URL.includes('pay.pesapal.com') && !BASE_URL.includes('/v3')) BASE_URL = BASE_URL + '/v3';

const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

export const getToken = async () => {
  if (!consumerKey || !consumerSecret) {
    throw new Error('Missing PESAPAL_CONSUMER_KEY or PESAPAL_CONSUMER_SECRET');
  }
  const url = `${BASE_URL}/api/Auth/RequestToken`;
  const data = { consumer_key: consumerKey, consumer_secret: consumerSecret };
  const res = await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
  return res.data?.token || res.data;
};
