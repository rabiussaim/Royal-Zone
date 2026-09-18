import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/product/ProductGrid';

const WishlistPage = () => {
  const { products, toggleWishlist } = useWishlist();

  return (
    <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h1>
        <div className="gold-line ml-0 mb-8" />

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-8xl mb-6 animate-float">❤️</div>
            <h2 className="font-display text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">Save items you love to your wishlist. Review them anytime and move them to cart easily.</p>
            <div className="flex justify-center gap-4">
              <Link to="/perfumes" className="btn-primary px-8 py-3">Explore Fragrances</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 dark:text-gray-400">{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
              <button
                onClick={() => products.forEach((p) => toggleWishlist(p))}
                className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
