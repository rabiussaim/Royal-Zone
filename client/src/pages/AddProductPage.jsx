import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddProductSection from '../components/product/AddProductSection';

const AddProductPage = () => {
  const { isLoggedIn, isOwner } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || !isOwner) return <Navigate to="/dashboard" replace />;

  return (
    <div className="pt-24 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-gold-500 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/dashboard')} className="hover:text-gold-500 transition-colors">Dashboard</button>
          <span>/</span>
          <span className="text-gold-500 font-medium">Add Product</span>
        </nav>

        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-2">Add New Product</h1>
        <div className="gold-line ml-0 mb-8" />

        <AddProductSection onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

export default AddProductPage;
