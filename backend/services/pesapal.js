import axios from "axios";
import CryptoJS from "crypto-js";

const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

const BASE_URL = "https://pay.pesapal.com/v3"; 
// Use https://cybqa.pesapal.com/pesapalv3  for sandbox

export const getToken = async () => {
  const url = `${BASE_URL}/api/Auth/RequestToken`;

  const data = {
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
  };

  const res = await axios.post(url, data);
  return res.data.token;
};
