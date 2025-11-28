import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://manwellback.onrender.com/api';
console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(config => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  // Use agentToken only for /delivery-agents/orders and /delivery/orders (agent endpoints)
  const isAgentOrders = config.url && (
    config.url.includes('/delivery-agents/orders') ||
    (config.url.includes('/delivery/orders') && config.method !== 'get') // PATCH/PUT for agent
  );
  // Use admin token for /delivery/orders and /delivery/agents (admin endpoints)
  const isAdminDelivery = config.url && (
    config.url.includes('/delivery/orders') || config.url.includes('/delivery/agents')
  );
  let token;
  if (isAgentOrders) {
    token = localStorage.getItem('agentToken');
  } else if (isAdminDelivery) {
    token = localStorage.getItem('token'); // admin token
  } else {
    token = localStorage.getItem('token');
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add getDashboardData method
api.getDashboardData = async () => {
  const res = await api.get('/admin/dashboard-data');
  return res.data;
};

// Pesapal payment
api.pesapalPayment = async ({ amount, description, email, phone }) => {
  const paymentRes = await api.post('/pesapal/initiate-payment', {
    amount,
    description,
    email,
    phone,
  });
  return paymentRes.data;
};

export default api;