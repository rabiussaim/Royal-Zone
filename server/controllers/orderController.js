const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { sendOrderNotification } = require('../utils/sendEmail');

// Stripe: initialize only if key is set and not a placeholder
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripeAvailable = stripeKey && !stripeKey.includes('PLACEHOLDER');
const stripe = stripeAvailable ? require('stripe')(stripeKey) : null;

// ─── Create Payment Intent (Stripe) ─────────────────────────────────────────
exports.createPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to server .env'
      });
    }

    const { amount, currency = 'pkr' } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit
      currency,
      metadata: { userId: req.user.id.toString() },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Create Order ────────────────────────────────────────────────────────────
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      notes,
      stripePaymentIntentId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // For Stripe payments, verify the payment intent was successful
    let paymentStatus = 'pending';
    if (paymentMethod === 'card' && stripePaymentIntentId) {
      if (stripe) {
        try {
          const intent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
          if (intent.status === 'succeeded') {
            paymentStatus = 'paid';
          } else {
            return res.status(400).json({ success: false, message: 'Payment not confirmed. Please complete card payment first.' });
          }
        } catch (stripeErr) {
          console.error('Stripe verification error:', stripeErr.message);
          // In test/placeholder mode, allow through
          if (stripeKey && stripeKey.includes('PLACEHOLDER')) {
            paymentStatus = 'pending';
          } else {
            return res.status(400).json({ success: false, message: 'Could not verify payment. Please try again.' });
          }
        }
      }
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      subtotal,
      shippingCost,
      tax,
      total,
      notes,
      ...(stripePaymentIntentId && { stripePaymentIntentId }),
    });

    // Clear cart after order placed
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // Send email notification to owner asynchronously in background
    sendOrderNotification(order).catch(err => console.error('Order email notification error:', err.message));

    res.status(201).json({
      success: true,
      data: order,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get User Orders ──────────────────────────────────────────────────────────
exports.getUserOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user.id });

    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      },
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Order ─────────────────────────────────────────────────────────
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ─── Cancel Order ─────────────────────────────────────────────────────────────
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this order' });
    }

    if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
      return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ─── Update Order Status (Admin) ──────────────────────────────────────────────
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ─── Get Stripe Config (publishable key for client) ──────────────────────────
exports.getStripeConfig = async (req, res) => {
  const pubKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const available = pubKey && !pubKey.includes('PLACEHOLDER');
  res.json({
    success: true,
    publishableKey: available ? pubKey : null,
    stripeAvailable: available,
  });
};
