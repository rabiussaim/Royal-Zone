import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './components/common/Toast';
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import PerfumesPage from './pages/PerfumesPage';
import BedsheetsPage from './pages/BedsheetsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AddProductPage from './pages/AddProductPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/common/ScrollToTop';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                  <ScrollToTop />
                <Routes>
                  {/* Auth routes (no main layout) */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Main layout routes */}
                  <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                  <Route path="/perfumes" element={<MainLayout><PerfumesPage /></MainLayout>} />
                  <Route path="/bedsheets" element={<MainLayout><BedsheetsPage /></MainLayout>} />
                  <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
                  <Route path="/blog" element={<MainLayout><BlogPage /></MainLayout>} />
                  <Route path="/blog/:slug" element={<MainLayout><BlogDetailPage /></MainLayout>} />
                  <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                  <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
                  <Route path="/order-success/:id" element={<MainLayout><OrderSuccessPage /></MainLayout>} />
                  <Route path="/order/:id" element={<MainLayout><OrderSuccessPage /></MainLayout>} />
                  <Route path="/invoice/:id" element={<MainLayout><OrderSuccessPage /></MainLayout>} />
                  <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
                  <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
                  <Route path="/owner-dashboard" element={<MainLayout><OwnerDashboardPage /></MainLayout>} />
                  <Route path="/add-product" element={<MainLayout><AddProductPage /></MainLayout>} />
                  <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
                  <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
                  <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
                  <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
                  <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
                </Routes>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
