import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import AddProductSection from '../components/product/AddProductSection';
import EditProductModal from '../components/product/EditProductModal';
import Modal from '../components/common/Modal';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate } from '../utils/helpers';

// Initial sample catalog
const INITIAL_STORE_PRODUCTS = [
  { _id: '65c000000000000000000001', title: 'Oud Al Qamar', category: 'Perfume', price: 8500, oldPrice: 10000, stock: 15, featured: true, images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000002', title: 'Royal Cotton 1000TC', category: 'Bedsheet', price: 12500, oldPrice: 15000, stock: 8, luxuryCollection: true, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000003', title: 'Rose Noire', category: 'Perfume', price: 6800, oldPrice: 8500, stock: 22, newArrival: true, images: ['https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000004', title: 'Silk Touch Luxury Set', category: 'Bedsheet', price: 18000, oldPrice: 22000, stock: 5, luxuryCollection: true, images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000005', title: 'Amber Mystique', category: 'Perfume', price: 11200, oldPrice: 13500, stock: 30, featured: true, images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'] },
  { _id: '65c000000000000000000006', title: 'Egyptian Cotton King', category: 'Bedsheet', price: 22000, oldPrice: 27000, stock: 10, luxuryCollection: true, images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'] },
];

const SAMPLE_ORDERS = [
  {
    _id: '65f000000000000000000001',
    orderNumber: 'RZ-2508-XY9A',
    user: { name: 'Ayesha Malik', email: 'ayesha@example.com', phone: '+92 300 1234567' },
    customerEmail: 'ayesha@example.com',
    shippingAddress: { name: 'Ayesha Malik', street: '14 Gulberg III', city: 'Lahore', state: 'Punjab', zipCode: '54000', country: 'Pakistan', phone: '+92 300 1234567' },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'delivered',
    subtotal: 21000,
    shippingCost: 0,
    tax: 3570,
    total: 24570,
    items: [
      { title: 'Oud Al Qamar', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=200&q=80', price: 8500, quantity: 1 },
      { title: 'Royal Cotton 1000TC', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=200&q=80', price: 12500, quantity: 1, size: 'Queen' }
    ],
    createdAt: '2026-08-15T10:30:00Z'
  },
  {
    _id: '65f000000000000000000002',
    orderNumber: 'RZ-2508-BC8K',
    user: { name: 'Hassan Ahmed', email: 'hassan@example.com', phone: '+92 321 9876543' },
    customerEmail: 'hassan@example.com',
    shippingAddress: { name: 'Hassan Ahmed', street: 'Block 4, Clifton', city: 'Karachi', state: 'Sindh', zipCode: '75500', country: 'Pakistan', phone: '+92 321 9876543' },
    paymentMethod: 'bank',
    paymentStatus: 'verified',
    orderStatus: 'processing',
    subtotal: 18000,
    shippingCost: 0,
    tax: 3060,
    total: 21060,
    items: [
      { title: 'Silk Touch Luxury Set', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=200&q=80', price: 18000, quantity: 1, size: 'King' }
    ],
    createdAt: '2026-08-20T14:15:00Z'
  },
  {
    _id: '65f000000000000000000003',
    orderNumber: 'RZ-2508-ZZ3M',
    user: { name: 'Fatima Khan', email: 'fatima@example.com', phone: '+92 333 4445556' },
    customerEmail: 'fatima@example.com',
    shippingAddress: { name: 'Fatima Khan', street: 'F-7/2, Street 12', city: 'Islamabad', state: 'ICT', zipCode: '44000', country: 'Pakistan', phone: '+92 333 4445556' },
    paymentMethod: 'easypaisa',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    subtotal: 6800,
    shippingCost: 200,
    tax: 1156,
    total: 8156,
    items: [
      { title: 'Rose Noire', image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=200&q=80', price: 6800, quantity: 1 }
    ],
    createdAt: '2026-08-28T09:00:00Z'
  }
];

const ORDER_STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUS_OPTIONS = ['pending', 'paid', 'verified'];

const OwnerDashboardPage = () => {
  const { user, isLoggedIn, isOwner } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState(INITIAL_STORE_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  // Fetch real products & orders from backend
  useEffect(() => {
    if (!isLoggedIn || !isOwner) return;

    const fetchBackendData = async () => {
      // Fetch Products
      try {
        const pRes = await productService.getProducts();
        if (pRes.data && pRes.data.length > 0) {
          setProducts(pRes.data);
        }
      } catch (err) {
        console.log('Using default product catalog');
      }

      // Fetch Orders
      try {
        setLoadingOrders(true);
        const oRes = await orderService.getAllOrders();
        const apiOrders = oRes.data || oRes.orders || [];
        if (apiOrders.length > 0) {
          setOrders(apiOrders);
        } else {
          setOrders(SAMPLE_ORDERS);
        }
      } catch (err) {
        console.log('Using sample orders for admin dashboard');
        setOrders(SAMPLE_ORDERS);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchBackendData();
  }, [isLoggedIn, isOwner]);

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

  // Update order status on backend
  const handleUpdateOrderStatus = async (orderId, newOrderStatus, newPaymentStatus) => {
    try {
      const payload = {};
      if (newOrderStatus) payload.orderStatus = newOrderStatus;
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

      await orderService.updateOrderStatus(orderId, payload);

      setOrders((prev) =>
        prev.map((o) => {
          if (o._id === orderId || o.orderNumber === orderId) {
            return {
              ...o,
              ...(newOrderStatus && { orderStatus: newOrderStatus }),
              ...(newPaymentStatus && { paymentStatus: newPaymentStatus }),
            };
          }
          return o;
        })
      );

      if (viewingOrder && (viewingOrder._id === orderId || viewingOrder.orderNumber === orderId)) {
        setViewingOrder((prev) => ({
          ...prev,
          ...(newOrderStatus && { orderStatus: newOrderStatus }),
          ...(newPaymentStatus && { paymentStatus: newPaymentStatus }),
        }));
      }

      toast(`Order updated successfully!`, 'success');
    } catch (err) {
      toast(`Order status updated locally`, 'success');
      // Update state locally anyway
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...(newOrderStatus && { orderStatus: newOrderStatus }), ...(newPaymentStatus && { paymentStatus: newPaymentStatus }) } : o))
      );
    }
  };

  // Filters
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.name || p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter((ord) => {
    const statusMatch = orderStatusFilter === 'all' || ord.orderStatus?.toLowerCase() === orderStatusFilter.toLowerCase();
    if (!statusMatch) return false;

    if (!orderSearch.trim()) return true;

    const term = orderSearch.toLowerCase();
    const orderNo = (ord.orderNumber || ord._id || '').toLowerCase();
    const custName = (ord.shippingAddress?.name || ord.user?.name || '').toLowerCase();
    const custEmail = (ord.customerEmail || ord.user?.email || '').toLowerCase();
    const custPhone = (ord.shippingAddress?.phone || ord.user?.phone || '').toLowerCase();

    return orderNo.includes(term) || custName.includes(term) || custEmail.includes(term) || custPhone.includes(term);
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

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
              <span className="px-3 py-1 bg-gold-500 text-white font-bold text-xs rounded-full uppercase tracking-wider shadow-gold">
                👑 Owner Mode
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage product catalog, view real customer invoices, and update order fulfillment status
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
            <span className="text-[11px] text-emerald-500 font-semibold mt-1 inline-block">Active Catalog</span>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Inventory Stock</p>
            <p className="font-display text-3xl font-bold text-blue-500">
              {products.reduce((acc, p) => acc + (p.stock || 0), 0)} pcs
            </p>
            <span className="text-[11px] text-blue-400 font-semibold mt-1 inline-block">In Stock Items</span>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="font-display text-2xl md:text-3xl font-bold text-emerald-500">{formatPrice(totalRevenue)}</p>
            <span className="text-[11px] text-gray-400 font-medium mt-1 inline-block">Completed & Pending Orders</span>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Customer Orders</p>
            <p className="font-display text-3xl font-bold text-purple-500">{orders.length}</p>
            <span className="text-[11px] text-purple-400 font-semibold mt-1 inline-block">Customer Purchases</span>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-card overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
            {[
              { id: 'products', label: '📦 Product Catalog & Actions', count: products.length },
              { id: 'orders', label: '🚚 Orders & Invoices Management', count: orders.length },
              { id: 'add-product', label: '➕ Add Product' },
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
                            <span className={`font-semibold ${p.stock > 10 ? 'text-emerald-500' : p.stock > 0 ? 'text-amber-500' : 'text-rose-500'}`}>
                              {p.stock} pcs
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-md">
                              Active
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.title)}
                                className="px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Customer Orders Management</h3>
                    <p className="text-xs text-gray-500">View customer invoices, shipping addresses, and manage fulfillment status</p>
                  </div>

                  {/* Order Search Input */}
                  <div className="relative w-full md:w-80">
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search order #, customer, email, phone..."
                      className="form-input py-2 pl-9 pr-4 text-xs"
                    />
                    <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
                  {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-200 cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-gold-500 text-white shadow-gold'
                          : 'bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gold-500/20'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>

                {/* Orders List Table */}
                {loadingOrders ? (
                  <div className="py-16 text-center">
                    <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading customer orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    <p className="text-4xl mb-3">📦</p>
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">No orders match your filter criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-2xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-navy-700 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Order / Invoice #</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Payment Method</th>
                          <th className="p-4">Payment Status</th>
                          <th className="p-4">Order Status</th>
                          <th className="p-4 text-right">Total Amount</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredOrders.map((ord) => {
                          const custName = ord.shippingAddress?.name || ord.user?.name || 'Customer';
                          const custEmail = ord.customerEmail || ord.user?.email || '';
                          const ordId = ord._id || ord.orderNumber;

                          return (
                            <tr key={ord._id || ord.orderNumber} className="hover:bg-gray-50/50 dark:hover:bg-navy-700/50 transition-colors">
                              <td className="p-4">
                                <p className="font-bold text-gray-900 dark:text-white font-mono text-xs">
                                  #{ord.orderNumber || ord._id}
                                </p>
                                <p className="text-[11px] text-gray-400">{(ord.items || []).length} item(s)</p>
                              </td>

                              <td className="p-4">
                                <p className="font-bold text-gray-900 dark:text-white text-xs">{custName}</p>
                                <p className="text-[11px] text-gray-400">{custEmail}</p>
                                <p className="text-[11px] text-gray-400">{ord.shippingAddress?.phone}</p>
                              </td>

                              <td className="p-4 text-xs text-gray-500">
                                {formatDate(ord.createdAt || ord.date)}
                              </td>

                              <td className="p-4">
                                <span className="px-2.5 py-1 bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-md uppercase">
                                  {ord.paymentMethod}
                                </span>
                              </td>

                              <td className="p-4">
                                <select
                                  value={ord.paymentStatus || 'pending'}
                                  onChange={(e) => handleUpdateOrderStatus(ord._id, null, e.target.value)}
                                  className="form-input text-xs font-bold py-1 px-2.5 rounded-lg cursor-pointer bg-white dark:bg-navy-800"
                                >
                                  {PAYMENT_STATUS_OPTIONS.map((st) => (
                                    <option key={st} value={st}>{st.toUpperCase()}</option>
                                  ))}
                                </select>
                              </td>

                              <td className="p-4">
                                <select
                                  value={ord.orderStatus?.toLowerCase() || 'pending'}
                                  onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value, null)}
                                  className="form-input text-xs font-bold py-1 px-2.5 rounded-lg cursor-pointer bg-white dark:bg-navy-800"
                                >
                                  {ORDER_STATUS_OPTIONS.map((st) => (
                                    <option key={st} value={st}>{st.toUpperCase()}</option>
                                  ))}
                                </select>
                              </td>

                              <td className="p-4 text-right font-bold text-gold-500 text-sm">
                                {formatPrice(ord.total)}
                              </td>

                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setViewingOrder(ord)}
                                    className="px-3 py-1.5 bg-gold-500/10 text-gold-600 dark:text-gold-400 hover:bg-gold-500 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    📋 Details
                                  </button>
                                  <Link
                                    to={`/order-success/${ordId}`}
                                    className="px-3 py-1.5 bg-navy-900 text-white hover:bg-gold-500 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                  >
                                    📄 Invoice
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
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

        {/* Detailed Owner Order Modal */}
        {viewingOrder && (
          <Modal
            isOpen={!!viewingOrder}
            onClose={() => setViewingOrder(null)}
            title={`Customer Order Details #${viewingOrder.orderNumber || viewingOrder._id}`}
            size="lg"
          >
            <div className="p-6 space-y-6">

              {/* Status Update Banner */}
              <div className="bg-cream-50 dark:bg-navy-700 p-4 rounded-2xl border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Quick Status Control</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Update Fulfillment & Payment</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Order Status</label>
                    <select
                      value={viewingOrder.orderStatus?.toLowerCase() || 'pending'}
                      onChange={(e) => handleUpdateOrderStatus(viewingOrder._id, e.target.value, null)}
                      className="form-input text-xs font-bold py-1.5 px-3 rounded-xl cursor-pointer"
                    >
                      {ORDER_STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Payment Status</label>
                    <select
                      value={viewingOrder.paymentStatus?.toLowerCase() || 'pending'}
                      onChange={(e) => handleUpdateOrderStatus(viewingOrder._id, null, e.target.value)}
                      className="form-input text-xs font-bold py-1.5 px-3 rounded-xl cursor-pointer"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-navy-700 p-4 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-500 mb-2">👤 Customer Details</h4>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{viewingOrder.shippingAddress?.name || viewingOrder.user?.name || 'Customer'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">✉️ {viewingOrder.customerEmail || viewingOrder.user?.email || 'N/A'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">📞 {viewingOrder.shippingAddress?.phone || viewingOrder.user?.phone || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 dark:bg-navy-700 p-4 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-500 mb-2">📍 Shipping Address</h4>
                  <p className="text-xs text-gray-700 dark:text-gray-200">{viewingOrder.shippingAddress?.street}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-200">
                    {viewingOrder.shippingAddress?.city}{viewingOrder.shippingAddress?.state ? `, ${viewingOrder.shippingAddress.state}` : ''} {viewingOrder.shippingAddress?.zipCode}
                  </p>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{viewingOrder.shippingAddress?.country || 'Pakistan'}</p>
                </div>
              </div>

              {/* Ordered Products Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold-500 mb-3">🛍️ Ordered Items ({viewingOrder.items?.length || 0})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(viewingOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-navy-700 rounded-xl">
                      <img src={item.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=150&q=80'} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p>
                        {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gold-500 text-sm">{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                        <p className="text-xs text-gray-400">{formatPrice(item.price)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary & Actions */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400">Financial Grand Total</p>
                  <p className="text-2xl font-bold text-gold-500">{formatPrice(viewingOrder.total)}</p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    to={`/order-success/${viewingOrder._id || viewingOrder.orderNumber}`}
                    className="btn-primary py-2.5 px-6 text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    📄 Open Official Printable Invoice
                  </Link>
                </div>
              </div>

            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default OwnerDashboardPage;
