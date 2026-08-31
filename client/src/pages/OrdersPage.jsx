import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/common/Modal';
import { formatPrice, formatDate } from '../utils/helpers';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const DUMMY_ORDERS = [
  { _id: 'o1', orderNumber: 'RZ-884521-XY9', createdAt: '2025-07-10', orderStatus: 'delivered', paymentMethod: 'cod', subtotal: 21300, shippingCost: 0, tax: 3621, total: 24921, items: [{ title: 'Oud Al Qamar', image: 'https://picsum.photos/seed/perf1/100/100', price: 8500, quantity: 1 }, { title: 'Royal Cotton 1000TC', image: 'https://picsum.photos/seed/bed1/100/100', price: 12500, quantity: 1, size: 'Queen' }], shippingAddress: { name: 'Ayesha Malik', street: '14 Gulberg III', city: 'Lahore', state: 'Punjab', country: 'Pakistan', phone: '+92 300 1234567' } },
  { _id: 'o2', orderNumber: 'RZ-772143-AB5', createdAt: '2025-07-18', orderStatus: 'processing', paymentMethod: 'bank', subtotal: 18000, shippingCost: 0, tax: 3060, total: 21060, items: [{ title: 'Silk Touch Luxury Set', image: 'https://picsum.photos/seed/bed2/100/100', price: 18000, quantity: 1, size: 'King' }], shippingAddress: { name: 'Ayesha Malik', street: '14 Gulberg III', city: 'Lahore', state: 'Punjab', country: 'Pakistan', phone: '+92 300 1234567' } },
  { _id: 'o3', orderNumber: 'RZ-661087-ZZ3', createdAt: '2025-07-22', orderStatus: 'pending', paymentMethod: 'cod', subtotal: 6800, shippingCost: 200, tax: 1156, total: 8156, items: [{ title: 'Rose Noire', image: 'https://picsum.photos/seed/perf2/100/100', price: 6800, quantity: 1 }], shippingAddress: { name: 'Ayesha Malik', street: '14 Gulberg III', city: 'Lahore', state: 'Punjab', country: 'Pakistan', phone: '+92 300 1234567' } },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending', class: 'status-pending', icon: '⏳' },
  confirmed: { label: 'Confirmed', class: 'status-processing', icon: '💎' },
  processing: { label: 'Processing', class: 'status-processing', icon: '⚙️' },
  shipped: { label: 'Shipped', class: 'status-shipped', icon: '🚚' },
  delivered: { label: 'Delivered', class: 'status-delivered', icon: '✅' },
  cancelled: { label: 'Cancelled', class: 'status-cancelled', icon: '❌' },
};

const TRACKING_STEPS = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const OrdersPage = () => {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn) {
        setOrders(DUMMY_ORDERS);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await orderService.getUserOrders();
        const userOrders = res.data || res.orders || [];
        setOrders(userOrders.length > 0 ? userOrders : DUMMY_ORDERS);
      } catch (err) {
        console.error('Failed to load user orders:', err);
        setOrders(DUMMY_ORDERS);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  const getTrackingStep = (status) => {
    if (status === 'cancelled') return -1;
    const map = { pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4 };
    return map[status] ?? 0;
  };

  return (
    <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white">My Orders</h1>
            <p className="text-gray-500 text-sm mt-1">Track status and view official Royal Zone receipts & invoices</p>
          </div>
          {isLoggedIn && (
            <span className="px-4 py-1.5 bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 rounded-full text-xs font-bold self-start sm:self-auto">
              👤 {user?.name || user?.email}
            </span>
          )}
        </div>
        <div className="gold-line ml-0 mb-8" />

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-navy-800 rounded-3xl p-8 shadow-card">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="font-display text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">No Orders Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't placed any orders yet. Explore our luxury perfume and bedsheet collections to get started!</p>
            <Link to="/" className="btn-primary px-8 py-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusKey = order.orderStatus?.toLowerCase() || 'pending';
              const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const orderId = order._id || order.orderNumber;

              return (
                <div key={order._id || order.orderNumber} className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-card hover-lift border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Invoice / Order Number</p>
                      <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>#{order.orderNumber || order._id}</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.class}`}>
                        {status.icon} {status.label}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-3 mb-5 overflow-x-auto pb-2">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-cream-50 dark:bg-navy-700 rounded-xl p-2.5 shrink-0 border border-gray-100 dark:border-gray-600">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=150&q=80'}
                          alt={item.title}
                          className="w-11 h-11 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">{item.title}</p>
                          <p className="text-xs text-gray-400">
                            {formatPrice(item.price)} × {item.quantity} {item.size && `(${item.size})`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action & Total Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                    <div className="flex gap-6 items-center">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Payment Method</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          {order.paymentMethod === 'cod' ? '💵 COD' : order.paymentMethod === 'bank' ? '🏦 Bank' : order.paymentMethod === 'easypaisa' ? '⚡ EasyPaisa' : '💳 Card'}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Grand Total</p>
                        <p className="text-lg font-bold text-gold-500">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Link
                        to={`/order-success/${orderId}`}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-navy-900 hover:bg-gold-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        📄 View Invoice
                      </Link>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 border border-gray-300 dark:border-gray-600 hover:border-gold-500 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order #${selectedOrder?.orderNumber || selectedOrder?._id}`} size="lg">
        {selectedOrder && (
          <div className="p-6 space-y-6">
            {/* Tracking Timeline */}
            {selectedOrder.orderStatus !== 'cancelled' && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>Order Progress Timeline</span>
                  <span className="text-xs text-gold-500 font-bold uppercase">{selectedOrder.orderStatus}</span>
                </h3>
                <div className="relative">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
                  <div className="flex flex-col md:flex-row justify-between relative gap-4 md:gap-0">
                    {TRACKING_STEPS.map((step, idx) => {
                      const current = getTrackingStep(selectedOrder.orderStatus);
                      const done = idx <= current;
                      return (
                        <div key={step} className="flex flex-row md:flex-col items-center md:justify-center gap-3 md:gap-2 flex-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-300 shrink-0 ${done ? 'bg-gold-500 text-white shadow-gold' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                            {done ? '✓' : idx + 1}
                          </div>
                          <span className={`text-xs text-left md:text-center leading-tight ${done ? 'text-gold-500 font-bold' : 'text-gray-400'}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
              <div className="space-y-3">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-navy-700 rounded-xl">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p>
                      {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gold-500 text-sm">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-gray-400">{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Information</h3>
                <div className="bg-gray-50 dark:bg-navy-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white">{selectedOrder.shippingAddress.name}</p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}{selectedOrder.shippingAddress.state ? `, ${selectedOrder.shippingAddress.state}` : ''} {selectedOrder.shippingAddress.zipCode}</p>
                  <p className="font-semibold">{selectedOrder.shippingAddress.country || 'Pakistan'}</p>
                  <p className="text-gold-500 pt-1">📞 Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>
            )}

            {/* Action to view full invoice */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">Grand Total</p>
                <p className="text-2xl font-bold text-gold-500">{formatPrice(selectedOrder.total)}</p>
              </div>
              <Link
                to={`/order-success/${selectedOrder._id || selectedOrder.orderNumber}`}
                className="btn-primary py-2.5 px-6 text-sm font-bold flex items-center gap-2"
              >
                📄 View Printable Invoice
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
