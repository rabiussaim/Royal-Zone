import api from './api';

export const productService = {
  // Get all products with optional filters
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  // Get single product by ID
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  // Get featured products (home page)
  getFeaturedProducts: async () => {
    const res = await api.get('/products/featured');
    return res.data;
  },
  // Get products by category slug
  getProductsByCategory: async (category, params = {}) => {
    const res = await api.get(`/products/category/${category}`, { params });
    return res.data;
  },
  // Search products by keyword
  searchProducts: async (query) => {
    const res = await api.get('/products/search', { params: { q: query } });
    return res.data;
  },
  // Create a new product
  createProduct: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data;
  },
  // Update existing product
  updateProduct: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },
  // Delete product
  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
