import axios from 'axios';
import { storage } from '../utils/helpers';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = storage.get('rz_token');
    // Only send REAL JWT tokens — demo tokens are client-only and will fail server auth
    if (token && token !== 'null' && token !== 'undefined' && !token.startsWith('demo_token_')) {
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
      // ONLY logout user if token is truly invalid (auth/me fails)
      // Do NOT logout for order, cart, or other API failures
      const shouldRedirect = url.includes('/auth/me');

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
