import api from './api';

export const orderService = {
  // Get Stripe publishable key from server
  getStripeConfig: async () => {
    const res = await api.get('/orders/stripe-config');
    return res.data;
  },

  // Create Stripe payment intent
  createPaymentIntent: async (amount) => {
    const res = await api.post('/orders/create-payment-intent', { amount });
    return res.data;
  },

  // Create order (COD / Bank / Card after payment confirmed)
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  // Get all user orders
  getUserOrders: async (params = {}) => {
    const res = await api.get('/orders', { params });
    return res.data;
  },

  // Get single order
  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const res = await api.put(`/orders/${id}/cancel`);
    return res.data;
  },
};
