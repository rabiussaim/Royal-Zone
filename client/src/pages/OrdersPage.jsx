import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/common/Modal';
import { formatPrice, formatDate } from '../utils/helpers';

const DUMMY_ORDERS = [
  { _id: 'o1', orderNumber: 'RZ-884521-XY9', createdAt: '2025-07-10', orderStatus: 'delivered', paymentMethod: 'cod', subtotal: 21300, shippingCost: 0, tax: 3621, total: 24921, items: [{ title: 'Oud Al Qamar', image: 'https://picsum.photos/seed/perf1/100/100', price: 8500, quantity: 1 }, { title: 'Royal Cotton 1000TC', image: 'https://picsum.photos/seed/bed1/100/100', price: 12500, quantity: 1, size: 'Queen' }], shippingAddress: { name: 'Ayesha Malik', street: '14 Gulberg III', city: 'Lahore', state: 'Punjab', country: 'Pakistan', phone: '+92 300 1234567' } },
  { _id: 'o2', orderNumber: 'RZ-772143-AB5', createdAt: '2025-07-18', orderStatus: 'processing', paymentMethod: 'bank', subtotal: 18000, shippingCost: 0, tax: 3060, total: 21060, items: [{ title: 'Silk Touch Luxury Set', image: 'https://picsum.photos/seed/bed2/100/100', price: 18000, quantity: 1, size: 'King' }], shippingAddress: { name: 'Ayesha Malik', street: '14 Gulberg III', city: 'Lahore', state: 'Punjab', country: 'Pakistan', phone: '+92 300 1234567' } },
  { _id: 'o3', orderNumber: 'RZ-661087-ZZ3', createdAt: '2025-07-22', orderStatus: 'pending', paymentMethod: 'cod', subtotal: 6800, shippingCost: 200, tax: 1156, total: 8156, items: [{ title: 'Rose Noire', image: 'https://picsum.photos/seed/perf2/100/100', price: 6800, quantity: 1 }], shippingAddress: { name: 'Ayesha Malik', street: '14 Gulberg III', city: 'Lahore', state: 'Punjab', country: 'Pakistan', phone: '+92 300 1234567' } },
  { _id: 'o4', orderNumber: 'RZ-550234-MM7', createdAt: '2025-06-28', orderStatus: 'cancelled', paymentMethod: 'cod', subtotal: 14500, shippingCost: 0, tax: 2465, total: 16965, items: [{ title: 'Midnight Oud', image: 'https://picsum.photos/seed/perf5/100/100', price: 14500, quantity: 1 }], shippingAddress: { name: 'Ayesha Malik', street: '14 Gulberg III', city: 'Lahore', state: 'Punjab', country: 'Pakistan', phone: '+92 300 1234567' } },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending', class: 'status-pending', icon: '⏳' },
  processing: { label: 'Processing', class: 'status-processing', icon: '⚙️' },
  shipped: { label: 'Shipped', class: 'status-shipped', icon: '🚚' },
  delivered: { label: 'Delivered', class: 'status-delivered', icon: '✅' },
  cancelled: { label: 'Cancelled', class: 'status-cancelled', icon: '❌' },
};

const TRACKING_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getTrackingStep = (status) => {
    if (status === 'cancelled') return -1;
    const map = { pending: 0, processing: 1, shipped: 2, delivered: 4 };
    return map[status] ?? 0;
  };

  return (
    <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
        <div className="gold-line ml-0 mb-8" />

        {DUMMY_ORDERS.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="font-display text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">No Orders Yet</h2>
            <p className="text-gray-500 mb-8">You haven't placed any orders. Start shopping to see your orders here.</p>
            <Link to="/" className="btn-primary px-8 py-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {DUMMY_ORDERS.map((order) => {
              const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
              return (
                <div key={order._id} className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-card hover-lift">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                      <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">{order.orderNumber}</h3>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.class}`}>
                        {status.icon} {status.label}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-3 mb-5 overflow-x-auto pb-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-navy-700 rounded-xl p-2 shrink-0">
                        <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{item.title}</p>
                          <p className="text-xs text-gray-400">× {item.quantity} {item.size && `| ${item.size}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-gray-400">Payment</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{order.paymentMethod.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-sm font-bold text-gold-500">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-secondary px-5 py-2 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.orderNumber}`} size="lg">
        {selectedOrder && (
          <div className="p-6 space-y-6">
            {/* Tracking Timeline */}
            {selectedOrder.orderStatus !== 'cancelled' && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tracking</h3>
                <div className="relative">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 md:hidden" />
                  <div className="flex flex-col md:flex-row justify-between relative gap-4 md:gap-0">
                    {TRACKING_STEPS.map((step, idx) => {
                      const current = getTrackingStep(selectedOrder.orderStatus);
                      const done = idx <= current;
                      return (
                        <div key={step} className="flex flex-row md:flex-col items-center md:justify-center gap-3 md:gap-2 flex-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-300 shrink-0 ${done ? 'bg-gold-500 text-white shadow-gold' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                            {done ? '✓' : idx + 1}
                          </div>
                          <span className={`text-xs text-left md:text-center leading-tight ${done ? 'text-gold-500 font-semibold' : 'text-gray-400'}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-navy-700 rounded-xl">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</p>
                      {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-gray-400">× {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h3>
              <div className="bg-gray-50 dark:bg-navy-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.shippingAddress.name}</p>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
                <p className="mt-2 text-gold-500">{selectedOrder.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span>{selectedOrder.shippingCost === 0 ? 'FREE' : formatPrice(selectedOrder.shippingCost)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Tax</span><span>{formatPrice(selectedOrder.tax)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-700"><span>Total</span><span className="text-gold-500">{formatPrice(selectedOrder.total)}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
