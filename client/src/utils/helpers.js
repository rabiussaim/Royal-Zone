// Helper: Format price in Pakistani Rupees
export const formatPrice = (price) => {
  if (!price && price !== 0) return 'PKR 0';
  return `PKR ${Number(price).toLocaleString('en-PK')}`;
};

// Helper: Format date to human-readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper: Truncate text with ellipsis
export const truncateText = (text = '', maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Helper: Calculate discount percentage
export const calculateDiscount = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

// Helper: Generate star array for rating display
export const generateStars = (rating = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push('full');
    else if (i === fullStars && hasHalf) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

// Helper: Debounce function
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Helper: Get image URL (handles both relative and absolute)
export const getImageUrl = (path) => {
  if (!path) return 'https://picsum.photos/seed/product/600/600';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
};

// Helper: Smooth scroll to top
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Helper: Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `RZ-${timestamp}-${random}`;
};

// Helper: Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Helper: Validate phone number
export const validatePhone = (phone) => {
  const re = /^(\+92|0)?[3][0-9]{9}$/;
  return re.test(phone.replace(/\s/g, ''));
};

// Helper: LocalStorage wrapper
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('localStorage set error');
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error('localStorage remove error');
    }
  },
};

// Helper: Clamp a number between min and max
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Helper: Slugify string
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .trim();
