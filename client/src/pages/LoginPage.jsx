import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import AuthLayout from '../layouts/AuthLayout';
import { storage } from '../utils/helpers';
import api from '../services/api';

// Replace with your actual Google Client ID from .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const LoginPage = () => {
  console.log('Google Client ID loaded in client:', GOOGLE_CLIENT_ID);
  const { login, loginWithToken } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // ── Load remembered credentials on mount ─────────────────────────────────
  useEffect(() => {
    const remembered = storage.get('rz_remember');
    if (remembered?.email) {
      setForm((prev) => ({
        ...prev,
        email: remembered.email,
        password: remembered.password || '',
        rememberMe: true,
      }));
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const cleanEmail = form.email.trim().toLowerCase();
    try {
      await login({ email: cleanEmail, password: form.password });

      // Save or clear remembered credentials
      if (form.rememberMe) {
        storage.set('rz_remember', { email: cleanEmail, password: form.password });
      } else {
        storage.remove('rz_remember');
      }

      toast('Welcome back! 👑', 'success');
      navigate('/');
    } catch (err) {
      storage.remove('rz_remember');
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast(msg, 'error');
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth Success ──────────────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      // Send credential to our backend for verification
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });

      const { token, user } = res.data;

      // Set user directly in auth context — no second API call needed
      loginWithToken(token, user);

      toast(`Welcome, ${user.name}! 👑`, 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Google sign-in failed. Please try email login.';
      toast(msg, 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const [googleOriginError, setGoogleOriginError] = useState(false);

  const handleGoogleError = (error) => {
    console.error('Google OAuth Error:', error);
    setGoogleOriginError(true);
    toast('Google Sign-In origin mismatch (400). Please add http://localhost:5173 to Google Cloud Console JavaScript origins.', 'error');
  };

  const googleConfigured = GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE');

  return (
    <AuthLayout>
      <div className="bg-navy-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-luxury p-8 md:p-10 animate-zoom-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to your Royal Zone account</p>
        </div>

        {/* Google Login */}
        <div className="mb-6">
          {googleConfigured ? (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <div className={`w-full transition-opacity ${googleLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  shape="rectangular"
                  theme="filled_black"
                  size="large"
                  width="100%"
                  text="continue_with"
                  locale="en"
                />
              </div>
              {googleLoading && (
                <p className="text-center text-gray-400 text-xs mt-2 flex items-center justify-center gap-2">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in with Google...
                </p>
              )}
              {googleOriginError && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left text-xs text-amber-300">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    ⚠️ Google OAuth Error: origin_mismatch (400)
                  </p>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    To fix this, go to Google Cloud Console → Credentials → Edit your Web Client ID → Add <strong className="text-gold-400 font-mono">http://localhost:5173</strong> under <em>Authorized JavaScript origins</em>.
                  </p>
                </div>
              )}
            </GoogleOAuthProvider>
          ) : (
            // Placeholder button when Google Client ID not set
            <div className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white/50 text-sm font-medium cursor-not-allowed select-none"
              title="Add VITE_GOOGLE_CLIENT_ID to client .env to enable">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">(Setup required)</span>
            </div>
          )}
        </div>



        {/* Divider */}
        <div className="relative flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-400 text-xs">or sign in with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ali@example.com"
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-white/20 focus:ring-gold-500/50 focus:border-gold-500'}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <button type="button" className="text-xs text-gold-500 hover:text-gold-400 transition-colors">Forgot Password?</button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500 focus:ring-red-500/50' : 'border-white/20 focus:ring-gold-500/50 focus:border-gold-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-600 bg-white/10 accent-yellow-500"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-400 cursor-pointer select-none">
              Remember me <span className="text-gray-500 text-xs">(saves email & password)</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base"
          >
            {loading ? (
              <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in...</>
            ) : 'Sign In to Royal Zone'}
          </button>
        </form>

        {/* Owner Login Quick Action (Visible only in local development) */}
        {import.meta.env.DEV && (
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => setForm({ email: 'saimlinkedin0000@gmail.com', password: 'AdminPassword123!', rememberMe: true })}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/30 transition-all inline-flex items-center gap-1.5"
            >
              <span>👑</span> Fill Store Owner Credentials (saimlinkedin0000@gmail.com)
            </button>
          </div>
        )}

        {/* Register link */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">Create Account</Link>
        </p>

      </div>
    </AuthLayout>
  );
};

export default LoginPage;
