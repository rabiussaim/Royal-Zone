const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  createPaymentIntent,
  getStripeConfig,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: Stripe publishable key config
router.get('/stripe-config', protect, getStripeConfig);

router.use(protect);

// Create Stripe Payment Intent
router.post('/create-payment-intent', createPaymentIntent);

// CRUD for orders
router.route('/')
  .post(createOrder)
  .get(getUserOrders);

router.route('/:id')
  .get(getOrderById);

router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
