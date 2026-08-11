import React, { useState } from 'react';
import Modal from '../common/Modal';
import StarRating from '../common/StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../common/Toast';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const QuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const mainImage = product.images?.[0] || `https://picsum.photos/seed/${product._id}/600/700`;
  const discount = product.discount || calculateDiscount(product.price, product.oldPrice);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product, quantity, selectedSize || null);
      toast(`${product.title} added to cart!`, 'success');
      onClose();
    } catch {
      toast('Failed to add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    await toggleWishlist(product);
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={null}>
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-1/2 bg-gray-100 dark:bg-navy-900 overflow-hidden" style={{ minHeight: '350px' }}>
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ minHeight: '350px' }}
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          {/* Category */}
          <p className="text-xs text-gold-500 font-medium uppercase tracking-widest">{product.category?.name || 'Royal Zone'}</p>

          {/* Title */}
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white leading-tight">{product.title}</h2>

          {/* Rating */}
          <StarRating rating={product.rating} count={product.reviewCount} />

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-base text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                {discount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-md text-white bg-red-500">-{discount}%</span>
                )}
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{product.description}</p>

          {/* Size selector (bedsheets) */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gold-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</p>
            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors text-gray-700 dark:text-gray-300"
              >−</button>
              <span className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-600">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors text-gray-700 dark:text-gray-300"
              >+</button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="flex-1 py-3 rounded-xl btn-primary text-sm font-semibold disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlist}
              className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                inWishlist ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-red-400 hover:text-red-500'
              }`}
            >
              <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <Link to={`/product/${product._id}`} onClick={onClose} className="text-center text-sm text-gold-500 hover:text-gold-400 underline underline-offset-2 transition-colors">
            View Full Details →
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default QuickView;
