import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../components/common/Toast';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import ProductCard from '../components/product/ProductCard';
import { formatDate, formatPrice } from '../utils/helpers';

const STATUS_CONFIG = {
  pending: { label: 'Pending', class: 'status-pending' },
  confirmed: { label: 'Confirmed', class: 'status-processing' },
  processing: { label: 'Processing', class: 'status-processing' },
  shipped: { label: 'Shipped', class: 'status-shipped' },
  delivered: { label: 'Delivered', class: 'status-delivered' },
  cancelled: { label: 'Cancelled', class: 'status-cancelled' },
};

const DashboardPage = () => {
  const { user, isLoggedIn, isOwner, updateProfile, logout } = useAuth();
  const { products: wishlistProducts } = useWishlist();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'orders') {
      const loadUserOrders = async () => {
        try {
          setLoadingOrders(true);
          const res = await orderService.getUserOrders();
          setUserOrders(res.data || res.orders || []);
        } catch (err) {
          console.error('Error fetching user orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      loadUserOrders();
    }
  }, [isLoggedIn, activeTab]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      toast('Profile updated successfully!', 'success');
    } catch {
      toast('Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast('Passwords do not match', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast('Password changed successfully!', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast('Failed to change password.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="pt-28 min-h-screen bg-cream-50 dark:bg-navy-900">
      <div className="container-custom py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white">Customer Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your profile, view real order invoices, and track purchases</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center text-3xl font-bold text-gold-500 mx-auto mb-3">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full capitalize">
                  {isOwner ? '👑 Store Owner' : '👤 Customer'}
                </span>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${activeTab === tab.id ? 'bg-gold-500/15 text-gold-600 dark:text-gold-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700'}`}
                  >
                    <span>{tab.icon}</span>{tab.label}
                  </button>
                ))}
                {isOwner && (
                  <Link
                    to="/owner-dashboard"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gold-500 hover:bg-gold-500/10 transition-colors"
                  >
                    <span>👑</span> Go to Owner Dashboard →
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-left"
                >
                  <span>🚪</span> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-card border border-gray-100 dark:border-gray-700">
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                      <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                      <input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} type="email" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                      <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="form-input" />
                    </div>
                  </div>
                  <button type="submit" disabled={savingProfile} className="btn-primary px-8 py-3 font-bold">
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-card border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Purchase History</h2>
                  <Link to="/orders" className="text-xs font-bold text-gold-500 hover:underline">
                    View Full Orders Page →
                  </Link>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center">
                    <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Fetching your orders...</p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't placed any orders yet.</p>
                    <Link to="/" className="btn-primary px-6 py-2.5 text-sm font-bold inline-block">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => {
                      const statusKey = order.orderStatus?.toLowerCase() || 'pending';
                      const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                      const ordId = order._id || order.orderNumber;

                      return (
                        <div key={order._id || order.orderNumber} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-gold-500/40 transition-colors gap-3">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm font-mono">#{order.orderNumber || order._id}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)} • {(order.items || []).length} item(s)</p>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-gray-100 dark:border-gray-700 sm:border-t-0">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.class}`}>{status.label}</span>
                            <span className="font-bold text-gold-500 text-sm">{formatPrice(order.total)}</span>
                            <Link
                              to={`/order-success/${ordId}`}
                              className="px-3 py-1.5 bg-navy-900 hover:bg-gold-500 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              📄 Invoice
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-card border border-gray-100 dark:border-gray-700">
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">My Wishlist ({wishlistProducts.length})</h2>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">❤️</div>
                    <p className="text-gray-500">Your wishlist is empty. <Link to="/" className="text-gold-500 hover:text-gold-400 font-semibold">Start shopping!</Link></p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {wishlistProducts.map((p) => <ProductCard key={p._id} product={p} />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-card border border-gray-100 dark:border-gray-700">
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                  {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([name, label]) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                      <input
                        type="password"
                        value={passwordForm[name]}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [name]: e.target.value })}
                        className="form-input"
                        placeholder="••••••••"
                      />
                    </div>
                  ))}
                  <button type="submit" disabled={savingPassword} className="btn-primary px-8 py-3 font-bold">
                    {savingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
