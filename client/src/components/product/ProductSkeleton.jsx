import React from 'react';

// Skeleton loading card with shimmer animation
const ProductSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white dark:bg-navy-800 shadow-card">
    <div className="skeleton" style={{ paddingTop: '110%' }} />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-5 w-4/5 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="flex gap-3 items-center">
        <div className="skeleton h-5 w-1/3 rounded" />
        <div className="skeleton h-4 w-1/4 rounded" />
      </div>
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  </div>
);

export default ProductSkeleton;
