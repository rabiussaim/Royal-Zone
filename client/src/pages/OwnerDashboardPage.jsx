import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import AddProductSection from '../components/product/AddProductSection';
import EditProductModal from '../components/product/EditProductModal';
import { productService } from '../services/productService';
import { formatPrice } from '../utils/helpers';

// Sample product list for catalog management
const INITIAL_STORE_PRODUCTS = [
  { _id: '65c000000000000000000001', title: 'Oud Al Qamar', category: 'Perfume', price: 8500, oldPrice: 10000, stock: 15, featured: true, images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000002', title: 'Royal Cotton 1000TC', category: 'Bedsheet', price: 12500, oldPrice: 15000, stock: 8, luxuryCollection: true, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000003', title: 'Rose Noire', category: 'Perfume', price: 6800, oldPrice: 8500, stock: 22, newArrival: true, images: ['https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000004', title: 'Silk Touch Luxury Set', category: 'Bedsheet', price: 18000, oldPrice: 22000, stock: 5, luxuryCollection: true, images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000005', title: 'Amber Mystique', category: 'Perfume', price: 11200, oldPrice: 13500, stock: 30, featured: true, images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000006', title: 'Egyptian Cotton King', category: 'Bedsheet', price: 22000, oldPrice: 27000, stock: 10, luxuryCollection: true, images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'] },
];

const SAMPLE_ORDERS = [
  { _id: 'ord1', orderNumber: 'RZ-884521-XY9', customer: 'Ayesha Malik', total: 24921, status: 'Delivered', date: '2025-07-10', items: 2 },
  { _id: 'ord2', orderNumber: 'RZ-772143-AB5', customer: 'Hassan Ahmed', total: 21060, status: 'Processing', date: '2025-07-18', items: 1 },
  { _id: 'ord3', orderNumber: 'RZ-661087-ZZ3', customer: 'Fatima Khan', total: 8156, status: 'Pending', date: '2025-07-22', items: 3 },
];

const OwnerDashboardPage = () => {
  const { user, isLoggedIn, isOwner } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState(INITIAL_STORE_PRODUCTS);
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  if (!isLoggedIn || !isOwner) return <Navigate to="/dashboard" replace />;

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await productService.deleteProduct(id);
      } catch {
        // Fallback for mock state
      }
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast(`Deleted "${title}" successfully`, 'info');
    }
  };

  const handleSaveProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    toast(`Order status updated to ${newStatus}`, 'success');
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.name || p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-28 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">

        {/* Top Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Store Owner Dashboard
              </h1>
              <span className="px-3 py-1 bg-gold-500 text-white font-bold text-xs rounded-full uppercase tracking-wider">
                👑 Owner Mode
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage catalog, add/edit/delete products, and track customer orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('add-product')}
              className="btn-primary py-2.5 px-5 text-sm font-bold flex items-center gap-2"
            >
              <span>➕</span> Add New Product
            </button>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Products</p>
            <p className="font-display text-3xl font-bold text-gold-500">{products.length}</p>
            <span className="text-[11px] text-green-500 font-semibold mt-1 inline-block">Active in Store</span>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Stock</p>
            <p className="font-display text-3xl font-bold text-blue-500">
              {products.reduce((acc, p) => acc + (p.stock || 0), 0)} pcs
            </p>
            <span className="text-[11px] text-blue-400 font-semibold mt-1 inline-block">Inventory Count</span>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="font-display text-2xl md:text-3xl font-bold text-green-500">PKR 54,137</p>
            <span className="text-[11px] text-gray-400 font-medium mt-1 inline-block">This Month</span>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Orders</p>
            <p className="font-display text-3xl font-bold text-purple-500">{orders.length}</p>
            <span className="text-[11px] text-purple-400 font-semibold mt-1 inline-block">Customer Purchases</span>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-card overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
            {[
              { id: 'products', label: '📦 Product Catalog & Actions', count: products.length },
              { id: 'add-product', label: '➕ Add Product' },
              { id: 'orders', label: '🚚 Orders Management', count: orders.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-gold-500 text-gold-600 dark:text-gold-400 bg-gold-500/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <div className="relative w-full sm:w-80">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products by name or category..."
                      className="form-input py-2.5 pl-10 pr-4 text-sm"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button onClick={() => setActiveTab('add-product')} className="btn-primary py-2.5 px-6 text-sm font-bold">
                    + Add New Product
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-2xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-navy-700 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Owner Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-navy-700/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'}
                              alt={p.title}
                              className="w-12 h-12 rounded-xl object-cover border border-gold-500/20"
                            />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.title}</p>
                              <p className="text-xs text-gray-400">ID: {p._id}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-semibold rounded-full">
                              {p.category?.name || p.category || 'Perfume'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-gold-500">{formatPrice(p.price)}</td>
                          <td className="p-4">
                            <span className={`font-semibold ${p.stock > 10 ? 'text-green-500' : p.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                              {p.stock} pcs
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-md">
                              Active
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.title)}
                                className="px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add Product Tab */}
            {activeTab === 'add-product' && (
              <AddProductSection
                onSuccess={() => {
                  setActiveTab('products');
                  toast('New product added to store catalog! 🎉', 'success');
                }}
              />
            )}

            {/* Orders Management Tab */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Manage Customer Orders</h3>
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord._id} className="p-5 border border-gray-100 dark:border-gray-700 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-gray-900 dark:text-white text-base">{ord.orderNumber}</p>
                          <span className="text-xs text-gray-400">• {ord.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Customer: <strong className="text-gray-900 dark:text-white">{ord.customer}</strong> ({ord.items} items)</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gold-500 text-lg">{formatPrice(ord.total)}</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="form-input text-xs font-bold py-1.5 px-3 rounded-xl cursor-pointer"
                        >
                          <option value="Pending">🟡 Pending</option>
                          <option value="Processing">🔵 Processing</option>
                          <option value="Delivered">🟢 Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            isOpen={!!editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSaveProduct}
          />
        )}

      </div>
    </div>
  );
};

export default OwnerDashboardPage;
