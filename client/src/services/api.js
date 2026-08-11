import axios from 'axios';
import { storage } from '../utils/helpers';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = storage.get('rz_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Only redirect to login for truly protected routes
      // Do NOT redirect for cart/wishlist/product API failures
      const shouldRedirect = (
        url.includes('/orders') ||
        url.includes('/auth/me') ||
        url.includes('/dashboard')
      ) && !url.includes('/orders/stripe-config');

      if (shouldRedirect) {
        storage.remove('rz_token');
        storage.remove('rz_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
