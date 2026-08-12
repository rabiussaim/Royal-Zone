import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import StarRating from '../common/StarRating';
import EditProductModal from './EditProductModal';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import { productService } from '../../services/productService';

const ProductCard = ({ product: initialProduct, onQuickView, onDelete }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isOwner } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(initialProduct);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [editingModal, setEditingModal] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!product || deleted) return null;

  const inWishlist = isInWishlist(product._id);
  const discount = product.discount || calculateDiscount(product.price, product.oldPrice);
  const mainImage = product.images?.[0] || `https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    try {
      await addToCart(product, 1);
      toast(`${product.title} added to cart!`, 'success');
    } catch {
      toast('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistLoading(true);
    try {
      await toggleWishlist(product);
      toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️', inWishlist ? 'info' : 'success');
    } catch {
      toast('Failed to update wishlist', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      try {
        await productService.deleteProduct(product._id);
      } catch {
        // Fallback for mock state
      }
      setDeleted(true);
      toast(`Deleted "${product.title}"`, 'info');
      onDelete?.(product._id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingModal(true);
  };

  return (
    <>
      <div className="product-card group relative">
        {/* Owner Quick Edit/Delete Bar */}
        {isOwner && (
          <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between gap-1 px-2 py-1 bg-navy-900/90 backdrop-blur-md rounded-xl text-xs font-bold text-white shadow-lg">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              👑 Owner
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleEdit}
                className="px-2 py-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-[11px] font-bold transition-all"
                title="Edit Product"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-[11px] font-bold transition-all"
                title="Delete Product"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}

        {/* Image wrapper */}
        <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
          <div className="card-image-wrapper bg-gray-100 dark:bg-navy-800">
            <img
              src={mainImage}
              alt={product.title}
              className="card-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80';
              }}
            />

            <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/25 transition-all duration-500" />

            {/* Out of stock overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center z-20">
                <span className="px-4 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full">Out of Stock</span>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className={`absolute ${isOwner ? 'top-10' : 'top-3'} left-3 z-10 flex flex-col gap-1.5`}>
          {discount > 0 && <span className="badge-sale">-{discount}%</span>}
          {!discount && product.newArrival && <span className="badge-new">New</span>}
          {product.luxuryCollection && <span className="badge-luxury">Luxury</span>}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute ${isOwner ? 'top-10' : 'top-3'} right-3 z-10 w-9 h-9 rounded-full bg-white dark:bg-navy-800 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold md:opacity-0 md:group-hover:opacity-100 opacity-100`}
        >
          <svg
            className={`w-4 h-4 transition-all duration-300 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-500 dark:text-gray-400'}`}
            fill={inWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>




        {/* Card content */}
        <div className="p-4">
          <p className="text-xs text-gold-500 font-medium uppercase tracking-wider mb-1">
            {product.category?.name || product.category || 'Royal Zone'}
          </p>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-base leading-tight mb-2 hover:text-gold-500 dark:hover:text-gold-400 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>

          <div className="mb-3">
            <StarRating rating={product.rating || 4.8} count={product.reviewCount || 45} size="sm" />
          </div>

          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 dark:text-white text-base">{formatPrice(product.price)}</span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs text-orange-500 font-medium whitespace-nowrap">Only {product.stock} left</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full">
            {/* Quick View Button on the Left */}
            <button
              type="button"
              onClick={handleQuickView}
              title="Quick View"
              className="p-2 sm:p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-200 hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 dark:hover:text-white hover:border-gold-500 transition-all duration-300 flex items-center justify-center shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="flex-1 py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="hidden sm:inline">Adding...</span>
                </>
              ) : product.stock === 0 ? (
                <span className="text-xs sm:text-sm">Out of Stock</span>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden sm:inline">Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingModal && (
        <EditProductModal
          product={product}
          isOpen={editingModal}
          onClose={() => setEditingModal(false)}
          onSave={(updated) => setProduct(updated)}
        />
      )}
    </>
  );
};

export default ProductCard;
