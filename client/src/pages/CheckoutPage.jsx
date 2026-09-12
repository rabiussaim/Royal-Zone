import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/helpers';


// ── Bank details (update with your real bank info) ───────────────────────────
const BANK_DETAILS = {
  bank: 'Bank AL Habib Limited',
  accountTitle: 'AFAQ HAMZA',
  accountNumber: '01600981006190016',
  iban: 'PK69BAHL0160098100619001',
  branch: 'Online',
  instructions: 'Transfer the exact amount and send screenshot to WhatsApp: +92-336-7947525 within 24 hours to confirm your order.',
};

const EASYPAISA_DETAILS = {
  number: '03367947525',
  iban: 'PK39TMFB0000000042714749',
  instructions: 'Send payment to the number above, then send screenshot to WhatsApp: +92-336-7947525 to confirm your order.',
};

const PAYMENT_METHODS = [
  {
    value: 'cod',
    label: 'Cash on Delivery',
    icon: '💵',
    desc: 'Pay when your order arrives',
    color: 'green',
  },
  {
    value: 'bank',
    label: 'Bank Transfer',
    icon: '🏦',
    desc: 'Transfer to our bank account',
    color: 'blue',
  },
  {
    value: 'easypaisa',
    label: 'EasyPaisa',
    icon: '⚡',
    desc: 'Pay via EasyPaisa mobile account',
    color: 'teal',
  },
];

// ── Input Field Component ─────────────────────────────────────────────────────
const InputField = ({ label, name, type = 'text', placeholder, required, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`form-input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// ── Main Checkout Component ───────────────────────────────────────────────────
const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errors, setErrors] = useState({});


  // ── Pricing ────────────────────────────────────────────────────────────────
  const shippingCost = subtotal >= 5000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.17);
  const grandTotal = subtotal + shippingCost + tax;

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.street.trim()) e.street = 'Street address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Place Order (COD / Bank / EasyPaisa) ─────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!items.length) { toast('Your cart is empty', 'error'); return; }
    await placeOrder();
  };

  // ── Core order creation ───────────────────────────────────────────────────
  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        product: item._id || item.productId,
        title: item.title,
        image: item.image || item.images?.[0] || '',
        price: item.price,
        quantity: item.quantity,
        size: item.size || '',
      }));

      const data = await orderService.createOrder({
        items: orderItems,
        shippingAddress: {
          name: form.name,
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode || '00000',
          country: form.country,
          phone: form.phone,
        },
        paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total: grandTotal,
        notes: form.notes,
        customerEmail: form.email,
      });

      const order = data.order || data.data || data;
      await clearCart();
      toast('Order placed successfully! Redirecting to invoice...', 'success');
      const targetId = order._id || order.orderNumber;
      if (targetId) {
        navigate(`/order-success/${targetId}`);
      } else {
        setOrderSuccess(order);
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || 'Order failed. Please try again.';
      if (status === 401) {
        toast('Please login to place an order.', 'error');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        toast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════
  //  SUCCESS SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (orderSuccess) {
    const isBankTransfer = (orderSuccess.paymentMethod || paymentMethod) === 'bank';
    const isEasyPaisa = (orderSuccess.paymentMethod || paymentMethod) === 'easypaisa';
    const isManual = isBankTransfer || isEasyPaisa;

    return (
      <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white dark:bg-navy-800 rounded-3xl p-8 md:p-10 text-center shadow-luxury animate-zoom-in">
          <div className="text-7xl mb-5 animate-float">{isEasyPaisa ? '⚡' : isBankTransfer ? '🏦' : '🎉'}</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {isManual ? 'Order Placed!' : 'Order Confirmed!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            {isManual
              ? 'Your order is placed. Please complete payment to confirm.'
              : 'Thank you for shopping with Royal Zone. Your luxury items are on their way!'}
          </p>

          {/* Order Number Box */}
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-5 mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Number</p>
            <p className="font-display text-2xl font-bold text-gold-500">{orderSuccess.orderNumber}</p>
            <p className="text-sm text-gray-500 mt-2">Total: {formatPrice(orderSuccess.total || grandTotal)}</p>
          </div>

          {/* EasyPaisa Payment Instructions */}
          {isEasyPaisa && (
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-2xl p-5 mb-6 text-left">
              <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-3 flex items-center gap-2">
                ⚡ EasyPaisa Payment Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">EasyPaisa Number:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{EASYPAISA_DETAILS.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">IBAN:</span>
                  <span className="font-mono font-semibold text-xs text-gray-900 dark:text-white">{EASYPAISA_DETAILS.iban}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-bold text-gold-500 text-base">{formatPrice(orderSuccess.total || grandTotal)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-teal-200 dark:border-teal-700">
                <p className="text-xs text-teal-700 dark:text-teal-400">📸 {EASYPAISA_DETAILS.instructions}</p>
              </div>
            </div>
          )}

          {/* Bank Transfer Instructions */}
          {isBankTransfer && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-5 mb-6 text-left">
              <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                🏦 Bank Transfer Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bank:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{BANK_DETAILS.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Account Title:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{BANK_DETAILS.accountTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Account #:</span>
                  <span className="font-mono font-semibold text-gray-900 dark:text-white">{BANK_DETAILS.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">IBAN:</span>
                  <span className="font-mono font-semibold text-xs text-gray-900 dark:text-white">{BANK_DETAILS.iban}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-bold text-gold-500 text-base">{formatPrice(orderSuccess.total || grandTotal)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-400">{BANK_DETAILS.instructions}</p>
              </div>
            </div>
          )}

          {/* Payment Method Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
              {isEasyPaisa ? '⚡ EasyPaisa — Awaiting Verification' : isBankTransfer ? '⏳ Awaiting Transfer' : '📦 COD — Pay on Delivery'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/order-success/${orderSuccess._id || orderSuccess.orderNumber}`} className="w-full sm:flex-1 btn-primary py-3 text-center font-bold">
              📄 View Official Invoice
            </Link>
            <Link to="/orders" className="w-full sm:flex-1 btn-secondary py-3 text-center">
              Track Order
            </Link>
            <Link to="/" className="w-full sm:flex-1 border border-gray-300 py-3 text-center rounded-xl text-gray-700 dark:text-gray-300">
              Shop More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  CHECKOUT FORM
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-2">Checkout</h1>
        <div className="gold-line ml-0 mb-8" />

        {/* Empty cart warning */}
        {!items.length && (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your cart is empty.</p>
            <Link to="/" className="btn-primary px-8 py-3">Shop Now</Link>
          </div>
        )}

        {items.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── Left Column: Form ──────────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-8">

                {/* Step 1: Billing & Shipping */}
                <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Billing & Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField label="Full Name" name="name" placeholder="Muhammad Ali" required value={form.name} onChange={handleChange} error={errors.name} />
                    <InputField label="Email" name="email" type="email" placeholder="ali@example.com" required value={form.email} onChange={handleChange} error={errors.email} />
                    <InputField label="Phone" name="phone" type="tel" placeholder="+92 300 1234567" required value={form.phone} onChange={handleChange} error={errors.phone} />
                    <InputField label="Country" name="country" placeholder="Pakistan" value={form.country} onChange={handleChange} />
                    <div className="sm:col-span-2">
                      <InputField label="Street Address" name="street" placeholder="House #, Street, Area" required value={form.street} onChange={handleChange} error={errors.street} />
                    </div>
                    <InputField label="City" name="city" placeholder="Lahore" required value={form.city} onChange={handleChange} error={errors.city} />
                    <InputField label="State / Province" name="state" placeholder="Punjab" required value={form.state} onChange={handleChange} error={errors.state} />
                    <InputField label="ZIP / Postal Code" name="zipCode" placeholder="54000" value={form.zipCode} onChange={handleChange} />
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Order Notes (optional)</label>
                      <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Special instructions, preferred delivery time..." className="form-input resize-none" />
                    </div>
                  </div>
                </div>

                {/* Step 2: Payment Method Selection */}
                <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {PAYMENT_METHODS.map((pm) => (
                        <button
                          key={pm.value}
                          type="button"
                          onClick={() => setPaymentMethod(pm.value)}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            paymentMethod === pm.value
                              ? 'border-gold-500 bg-gold-500/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gold-500/50'
                          } cursor-pointer`}
                        >
                          <div className="text-2xl mb-2">{pm.icon}</div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{pm.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{pm.desc}</p>
                        </button>
                    ))}
                  </div>

                  {/* ── COD Info ──────────────────────────────────────────── */}
                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">💵</span>
                        <div>
                          <p className="font-semibold text-green-800 dark:text-green-300">Cash on Delivery</p>
                          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                            Your order will be delivered to your address. Please keep <strong>{formatPrice(grandTotal)}</strong> ready at the time of delivery.
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-500 mt-2">🕐 Delivery within 3–5 working days</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Bank Transfer Info ────────────────────────────────── */}
                  {paymentMethod === 'bank' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
                      <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                        🏦 Bank Transfer Details
                      </h3>
                      <div className="space-y-2.5">
                        {[
                          ['Bank', BANK_DETAILS.bank],
                          ['Account Title', BANK_DETAILS.accountTitle],
                          ['Account Number', BANK_DETAILS.accountNumber],
                          ['IBAN', BANK_DETAILS.iban],
                          ['Branch', BANK_DETAILS.branch],
                        ].map(([label, val]) => (
                          <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white select-all">{val}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Amount to Transfer:</span>
                            <span className="text-lg font-bold text-gold-500">{formatPrice(grandTotal)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-3 leading-relaxed">
                        📸 {BANK_DETAILS.instructions}
                      </p>
                    </div>
                  )}

                  {/* ── EasyPaisa Info ────────────────────────────────────── */}
                  {paymentMethod === 'easypaisa' && (
                    <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl">
                      <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-3 flex items-center gap-2">
                        ⚡ EasyPaisa Payment Details
                      </h3>
                      <div className="space-y-2.5">
                        {[
                          ['EasyPaisa Number', EASYPAISA_DETAILS.number],
                          ['IBAN', EASYPAISA_DETAILS.iban],
                        ].map(([label, val]) => (
                          <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white select-all">{val}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-teal-200 dark:border-teal-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Amount to Pay:</span>
                            <span className="text-lg font-bold text-gold-500">{formatPrice(grandTotal)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-teal-700 dark:text-teal-400 mt-3 leading-relaxed">
                        📸 {EASYPAISA_DETAILS.instructions}
                      </p>
                    </div>
                  )}

                  {/* ── Stripe Card Form — REMOVED (EasyPaisa replaces it) ─ */}
                </div>
              </div>

              {/* ── Right Column: Order Summary ────────────────────────────── */}
              <div>
                <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-card sticky top-24">
                  <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
                    {items.map((item) => {
                      const itemId = item._id || item.productId;
                      return (
                        <div key={itemId} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-navy-700 shrink-0">
                            <img
                              src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=100&q=80'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                            {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                            <p className="text-xs text-gray-400">× {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-700 mb-4" />

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 mb-5 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? 'text-green-500 font-medium' : ''}>
                        {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {shippingCost === 0 && (
                      <p className="text-xs text-green-500">🎉 Free shipping on orders above PKR 5,000!</p>
                    )}
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tax (17%)</span><span>{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-700 mb-4" />
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-display text-2xl font-bold text-gold-500">{formatPrice(grandTotal)}</span>
                  </div>

                  {/* Submit Button — for COD, Bank & EasyPaisa */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Placing Order...
                      </>
                    ) : paymentMethod === 'bank' ? '🏦 Place Order (Bank Transfer)' 
                      : paymentMethod === 'easypaisa' ? '⚡ Place Order (EasyPaisa)'
                      : '🎉 Place Order'}
                  </button>

                  <p className="text-xs text-center text-gray-400 mt-4">🔒 Your information is 100% secure</p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
