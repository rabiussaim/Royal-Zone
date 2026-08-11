import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import QuickView from './QuickView';

// Responsive product grid with loading skeletons and quick view
const ProductGrid = ({ products = [], loading = false, emptyMessage = 'No products found.' }) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="font-display text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Nothing here yet</h3>
        <p className="text-gray-500 dark:text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
};

export default ProductGrid;
