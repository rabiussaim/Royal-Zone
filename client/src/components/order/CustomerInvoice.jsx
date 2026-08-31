import React from 'react';
import { formatPrice, formatDate } from '../../utils/helpers';

/**
 * CustomerInvoice Component
 * Premium Luxury Invoice for Royal Zone Official Online Store.
 * Supports screen display and clean print/download functionality via window.print() and CSS media print rules.
 */
const CustomerInvoice = ({ order, showActions = true }) => {
  if (!order) return null;

  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = formatDate(order.createdAt) || createdAt.toLocaleDateString();
  const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const shipping = order.shippingAddress || {};
  const items = order.items || [];

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'confirmed': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'verified': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ── Action Buttons (Hidden on Print) ────────────────────────────── */}
      {showActions && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-white dark:bg-navy-800 rounded-2xl shadow-card border border-gold-500/20">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="text-xl">📄</span>
            <span className="font-semibold">Official Order Receipt & Invoice</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-navy-900 dark:bg-navy-700 hover:bg-gold-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Invoice
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-amber-600 hover:to-gold-500 text-navy-900 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-gold flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* ── Invoice Document Container ──────────────────────────────────── */}
      <div className="printable-invoice bg-white text-gray-900 rounded-3xl p-8 sm:p-12 shadow-luxury border border-gold-500/30 overflow-hidden relative">

        {/* Top Decorative Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-navy-900 via-gold-500 to-navy-900" />

        {/* ── Header Row ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">👑</span>
              <h1 className="font-display text-3xl font-bold tracking-widest text-navy-900 uppercase">
                ROYAL ZONE
              </h1>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold-600 ml-11">
              Official Online Store • Luxury Perfumes & Lifestyle
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-navy-900 text-gold-400 text-xs font-bold tracking-widest uppercase rounded-md mb-2">
              INVOICE / RECEIPT
            </span>
            <p className="font-mono text-lg font-bold text-gray-900">
              #{order.orderNumber || order._id}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              {formattedDate} at {formattedTime}
            </p>
          </div>
        </div>

        {/* ── Info Grid (Customer & Order Metadata) ───────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-gray-200">

          {/* Customer & Shipping Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600 flex items-center gap-1.5">
              <span>📍</span> Customer & Shipping Address
            </h3>
            <p className="text-base font-bold text-gray-900">{shipping.name || order.user?.name || 'Customer'}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{shipping.street}</p>
            <p className="text-sm text-gray-600">
              {shipping.city}{shipping.state ? `, ${shipping.state}` : ''} {shipping.zipCode ? ` - ${shipping.zipCode}` : ''}
            </p>
            <p className="text-sm text-gray-600 font-semibold">{shipping.country || 'Pakistan'}</p>
            <div className="pt-2 text-xs text-gray-500 space-y-1">
              <p><strong className="text-gray-700">Phone:</strong> {shipping.phone || order.user?.phone || 'N/A'}</p>
              <p><strong className="text-gray-700">Email:</strong> {order.customerEmail || order.user?.email || 'N/A'}</p>
            </div>
          </div>

          {/* Order Meta & Status */}
          <div className="space-y-3 bg-cream-50 p-5 rounded-2xl border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600 flex items-center gap-1.5 mb-3">
              <span>📋</span> Order Overview
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500 block">Order ID</span>
                <span className="font-mono font-semibold text-gray-800 text-ellipsis overflow-hidden block">
                  {order._id || order.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Payment Method</span>
                <span className="font-bold text-gray-800 uppercase">
                  {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : order.paymentMethod === 'bank' ? '🏦 Bank Transfer' : order.paymentMethod === 'easypaisa' ? '⚡ EasyPaisa' : '💳 Credit Card'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Order Status</span>
                <span className={`inline-block px-2.5 py-0.5 mt-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border ${getStatusBadgeClass(order.orderStatus)}`}>
                  {order.orderStatus || 'Pending'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Payment Status</span>
                <span className={`inline-block px-2.5 py-0.5 mt-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border ${getPaymentStatusBadge(order.paymentStatus)}`}>
                  {order.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Purchased Items Table ────────────────────────────────────── */}
        <div className="py-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-4 flex items-center gap-1.5">
            <span>🛍️</span> Purchased Products ({items.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-2">Item</th>
                  <th className="py-3 px-2">Details</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-4 px-2 w-16">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=200&q=80'}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </td>
                    <td className="py-4 px-2">
                      <p className="font-bold text-gray-900">{item.title}</p>
                      {item.size && (
                        <p className="text-xs text-gray-500 mt-0.5">Size / Variant: <span className="font-semibold text-gray-700">{item.size}</span></p>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center font-bold text-gray-800">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-2 text-right font-medium text-gray-600">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-4 px-2 text-right font-bold text-navy-900">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Summary & Grand Total ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start pt-6 border-t-2 border-gray-200 gap-6">

          {/* Customer Notes / Terms */}
          <div className="max-w-xs text-xs text-gray-500 space-y-1.5">
            <p className="font-bold text-gray-800 uppercase tracking-wider">Thank You for Shopping!</p>
            <p>For support or inquiry regarding your order, contact us on WhatsApp: <strong>+92-336-7947525</strong></p>
            {order.notes && (
              <p className="pt-2 italic text-gray-600">Note: "{order.notes}"</p>
            )}
          </div>

          {/* Financial Breakdown Table */}
          <div className="w-full sm:w-72 bg-cream-50 p-5 rounded-2xl border border-gray-200 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-medium text-gray-900">
                {order.shippingCost === 0 ? <strong className="text-emerald-600 uppercase text-xs">FREE</strong> : formatPrice(order.shippingCost)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Sales Tax (17%)</span>
              <span className="font-medium text-gray-900">{formatPrice(order.tax)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-bold">-{formatPrice(order.discount)}</span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-gold-500/30 flex justify-between items-baseline">
              <span className="font-display font-bold text-base text-navy-900 uppercase">Grand Total</span>
              <span className="font-display font-extrabold text-2xl text-gold-600">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-[11px] text-gray-400 font-medium tracking-wider uppercase flex items-center justify-center gap-4">
          <span>👑 Royal Zone Authenticity Guarantee</span>
          <span>✦</span>
          <span>100% Original Products</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoice;
