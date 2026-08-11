import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/common/Toast';
import { formatPrice } from '../utils/helpers';

const CartPage = () => {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const SHIPPING_THRESHOLD = 5000;
  const TAX_RATE = 0.17;
  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : 200;
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + shippingCost + tax;

  const handleRemove = async (itemId, title) => {
    await removeItem(itemId);
    toast(`${title} removed from cart`, 'info');
  };

  const handleClear = async () => {
    await clearCart();
    toast('Cart cleared', 'info');
  };

  if (!itemCount) {
    return (
      <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900 flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6 animate-float">🛒</div>
        <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">Looks like you haven't added anything yet. Explore our luxury collections to find something special.</p>
        <div className="flex gap-4">
          <Link to="/perfumes" className="btn-primary px-8 py-3">Shop Perfumes</Link>
          <Link to="/bedsheets" className="btn-secondary px-8 py-3">Shop Bedsheets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
        <div className="gold-line ml-0 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">{itemCount} item{itemCount > 1 ? 's' : ''} in cart</p>
              <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium">Clear Cart</button>
            </div>

            {items.map((item) => {
              const image = item.image || item.images?.[0] || `https://picsum.photos/seed/${item.productId || item._id}/200/200`;
              const title = item.title || 'Product';
              const price = item.price || 0;
              const itemId = item._id || item.productId;

              return (
                <div key={itemId} className="bg-white dark:bg-navy-800 rounded-2xl p-3.5 sm:p-5 shadow-card flex gap-3.5 sm:gap-4 animate-fade-in">
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-navy-700 shrink-0">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">{title}</h3>
                        {item.size && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Size: {item.size}</p>}
                      </div>
                      <button
                        onClick={() => handleRemove(itemId, title)}
                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden self-start">
                        <button onClick={() => updateQuantity(itemId, item.quantity - 1)} className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors text-gray-600 dark:text-gray-400">−</button>
                        <span className="px-4 py-1 text-sm font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-600">{item.quantity}</span>
                        <button onClick={() => updateQuantity(itemId, item.quantity + 1)} className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors text-gray-600 dark:text-gray-400">+</button>
                      </div>
                      {/* Line total */}
                      <span className="font-bold text-gray-900 dark:text-white sm:text-right">{formatPrice(price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link to="/perfumes" className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors text-sm font-medium mt-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-500 font-medium' : ''}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax (17% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {subtotal < SHIPPING_THRESHOLD && (
                  <div className="text-xs text-gold-600 dark:text-gold-400 bg-gold-500/10 rounded-lg p-3">
                    Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-700 mb-5" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900 dark:text-white text-lg">Grand Total</span>
                <span className="font-display text-2xl font-bold text-gold-500">{formatPrice(grandTotal)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-4 text-base"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>🔒 Secure</span>
                <span>💳 COD Available</span>
                <span>✅ Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
