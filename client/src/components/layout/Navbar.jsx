import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import AnnouncementBar from './AnnouncementBar';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, isOwner, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const isHomePage = location.pathname === '/';
  const isTransparent = false;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate('/');
  };

  // Nav links — + Add Product is ONLY visible if user is authenticated as Store Owner
  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/bedsheets', label: 'Bedsheet Designs' },
    { to: '/perfumes', label: 'Perfumes' },
    { to: '/blog', label: 'Journal' },
    ...(isOwner ? [{ to: '/add-product', label: '✨ Add Product' }] : []),
    { to: '/about', label: 'About' },
    { to: '/orders', label: 'Orders' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Free Delivery Announcement Bar */}
      <AnnouncementBar visible={announcementOpen} onClose={() => setAnnouncementOpen(false)} />

      {/* Main Navbar */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          announcementOpen ? 'top-9' : 'top-0'
        } ${
          isTransparent
            ? 'bg-transparent py-1.5'
            : 'navbar-glass shadow-md py-0.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-90 group"
            >
              <img
                src="/logo.png"
                alt="Royal Zone Logo"
                className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className={`font-display text-xl md:text-2xl font-bold tracking-wide hidden sm:inline ${isTransparent ? 'text-white' : 'text-navy-900 dark:text-white'}`}>
                ROYAL <span style={{ color: 'var(--color-gold)' }}>ZONE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 relative pb-1 ${
                      isActive
                        ? 'text-gold-500 font-semibold'
                        : isTransparent
                        ? 'text-white hover:text-gold-400'
                        : 'text-gray-800 dark:text-gray-100 hover:text-gold-500'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500 rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className={`p-2 rounded-full transition-all duration-200 hover:bg-gold-500/10 ${
                  isTransparent ? 'text-white hover:text-gold-400' : 'text-gray-700 dark:text-gray-200 hover:text-gold-500'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className={`relative p-2 rounded-full transition-all duration-200 hover:bg-gold-500/10 hidden sm:block ${
                  isTransparent ? 'text-white hover:text-gold-400' : 'text-gray-700 dark:text-gray-200 hover:text-gold-500'
                }`}
              >
                <svg className="w-5 h-5" fill={wishlistCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label="Cart"
                className={`relative p-2 rounded-full transition-all duration-200 hover:bg-gold-500/10 ${
                  isTransparent ? 'text-white hover:text-gold-400' : 'text-gray-700 dark:text-gray-200 hover:text-gold-500'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-gold">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  aria-label="User account"
                  className={`flex items-center gap-1.5 p-2 rounded-full transition-all duration-200 hover:bg-gold-500/10 ${
                    isTransparent ? 'text-white hover:text-gold-400' : 'text-gray-700 dark:text-gray-200 hover:text-gold-500'
                  }`}
                >
                  {isLoggedIn && user ? (
                    <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </button>

                {/* User Dropdown */}
                {userDropdown && (
                  <div className="absolute right-0 top-12 w-56 bg-white dark:bg-navy-800 rounded-2xl shadow-luxury border border-gray-100 dark:border-gray-700 overflow-hidden animate-zoom-in z-50">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400 capitalize">
                            {isOwner ? '👑 Store Owner' : '👤 Customer'}
                          </span>
                        </div>

                        {/* Owner Dashboard link - strictly for store owners */}
                        {isOwner ? (
                          <>
                            <Link
                              to="/owner-dashboard"
                              onClick={() => setUserDropdown(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gold-600 dark:text-gold-400 bg-gold-500/10 hover:bg-gold-500/20 transition-colors"
                            >
                              <span>👑</span> Owner Dashboard
                            </Link>
                            <Link
                              to="/add-product"
                              onClick={() => setUserDropdown(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gold-500/10 hover:text-gold-500 transition-colors"
                            >
                              <span>➕</span> Add New Product
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/dashboard"
                            onClick={() => setUserDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gold-500/10 hover:text-gold-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            My Dashboard
                          </Link>
                        )}

                        <Link
                          to="/orders"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gold-500/10 hover:text-gold-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          My Orders
                        </Link>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <div className="p-3">
                        <Link to="/login" onClick={() => setUserDropdown(false)} className="block w-full text-center py-2 px-4 btn-primary text-sm rounded-xl mb-2">
                          Sign In
                        </Link>
                        <Link to="/register" onClick={() => setUserDropdown(false)} className="block w-full text-center py-2 px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors">
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dark/Light Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-full transition-all duration-200 hover:bg-gold-500/10 hidden sm:block ${
                  isTransparent ? 'text-white hover:text-gold-400' : 'text-gray-700 dark:text-gray-200 hover:text-gold-500'
                }`}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
                className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
                  isTransparent ? 'text-white hover:text-gold-400' : 'text-gray-700 dark:text-gray-200 hover:text-gold-500'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 animate-slide-down shadow-luxury max-h-[80vh] overflow-y-auto">
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-gold-500/15 text-gold-500'
                        : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isOwner && (
                <NavLink
                  to="/owner-dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-bold text-gold-500 bg-gold-500/10"
                >
                  👑 Owner Dashboard
                </NavLink>
              )}

              {/* Wishlist Link inside Mobile Drawer */}
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800 transition-all"
              >
                <span className="flex items-center gap-2">❤️ Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-gold-500 text-white font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Theme Toggle inside Mobile Drawer */}
              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800 transition-all text-left"
              >
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? '☀️' : '🌙'} Theme
                </span>
                <span className="text-sm text-gray-500 capitalize">{theme} Mode</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-navy-900/80 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-luxury border border-gray-100 dark:border-gray-700 animate-zoom-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Search Royal Zone</h3>
              <button onClick={() => setSearchOpen(false)} className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search perfumes, bedsheets, luxury sets..."
                className="form-input py-4 pl-12 pr-24 text-base"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-5 text-sm">
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
