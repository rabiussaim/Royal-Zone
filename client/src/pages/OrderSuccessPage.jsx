import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomerInvoice from '../components/order/CustomerInvoice';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('Order ID missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        const orderData = res.data || res.order || res;
        setOrder(orderData);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Order could not be loaded.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-cream-50 dark:bg-navy-900 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-display text-lg text-gray-700 dark:text-gray-300">Generating Your Royal Zone Invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-32 min-h-screen bg-cream-50 dark:bg-navy-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Order Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">{error || 'The order you requested could not be retrieved.'}</p>
        <div className="flex gap-4">
          <Link to="/" className="btn-primary px-6 py-3">Return Home</Link>
          <Link to="/orders" className="btn-secondary px-6 py-3">View My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-6">

        {/* ── Success Notification Header (Hidden on Print) ──────────────── */}
        <div className="no-print bg-emerald-900/90 text-white rounded-3xl p-6 md:p-8 mb-8 text-center shadow-luxury border border-emerald-500/30">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg animate-float">
            ✓
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-lg mx-auto mb-4">
            Thank you for your order. Your Royal Zone order has been received and is being processed.
          </p>

          <div className="inline-flex items-center gap-3 bg-black/30 backdrop-blur px-5 py-2 rounded-full border border-emerald-500/30 text-xs font-mono">
            <span>Order Number: <strong className="text-gold-400 font-bold">{order.orderNumber}</strong></span>
          </div>
        </div>

        {/* ── Printable Invoice Document ─────────────────────────────────── */}
        <CustomerInvoice order={order} showActions={true} />

        {/* ── Page Footer Action Buttons (Hidden on Print) ───────────────── */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to="/orders" className="w-full sm:w-auto btn-secondary px-8 py-3.5 text-center font-bold">
            🛍️ My Orders
          </Link>
          <Link to="/" className="w-full sm:w-auto btn-primary px-8 py-3.5 text-center font-bold">
            ✨ Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
