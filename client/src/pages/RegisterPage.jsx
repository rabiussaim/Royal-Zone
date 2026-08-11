import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import AuthLayout from '../layouts/AuthLayout';

// Move Field sub-component outside parent so React DOM nodes persist across re-renders
const FormField = ({ label, name, type = 'text', placeholder, required, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">{label} {required && <span className="text-red-400">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-white/20 focus:ring-gold-500/50 focus:border-gold-500'}`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const strength = getPasswordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.acceptTerms) e.acceptTerms = 'You must accept terms';
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
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast('Account created! Welcome to Royal Zone 👑', 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-navy-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-luxury p-8 md:p-10 animate-zoom-in">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join the Royal Zone family today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full Name" name="name" placeholder="Muhammad Ali" required value={form.name} onChange={handleChange} error={errors.name} />
          <FormField label="Email Address" name="email" type="email" placeholder="ali@example.com" required value={form.email} onChange={handleChange} error={errors.email} />
          <FormField label="Phone Number" name="phone" type="tel" placeholder="+92 300 1234567" required value={form.phone} onChange={handleChange} error={errors.phone} />

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password <span className="text-red-400">*</span></label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className={`w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500' : 'border-white/20 focus:ring-gold-500/50 focus:border-gold-500'}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPass ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
                </svg>
              </button>
            </div>
            {/* Strength bar */}
            {form.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-gray-600'}`} />
                  ))}
                </div>
                <span className={`text-xs font-medium ${strengthColor.replace('bg-', 'text-')}`}>{strengthLabel}</span>
              </div>
            )}
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-white/20 focus:ring-gold-500/50 focus:border-gold-500'}`}
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="acceptTerms" name="acceptTerms" checked={form.acceptTerms} onChange={handleChange} className="w-4 h-4 mt-0.5 rounded border-gray-600 accent-yellow-500 cursor-pointer" />
              <label htmlFor="acceptTerms" className="text-sm text-gray-400 cursor-pointer leading-relaxed">
                I agree to the <button type="button" className="text-gold-500 hover:text-gold-400 font-medium">Terms of Service</button> and <button type="button" className="text-gold-500 hover:text-gold-400 font-medium">Privacy Policy</button>
              </label>
            </div>
            {errors.acceptTerms && <p className="text-red-400 text-xs mt-1">{errors.acceptTerms}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base mt-2"
          >
            {loading ? (
              <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating Account...</>
            ) : 'Join Royal Zone 👑'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
