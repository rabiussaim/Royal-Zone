import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-16" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #111827 50%, #0A0F1E 100%)' }}>
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full blur-3xl opacity-20 animate-float" style={{ background: 'radial-gradient(circle, #C9A96E, transparent)' }} />
      <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-full blur-2xl opacity-15 animate-float-reverse" style={{ background: 'radial-gradient(circle, #D4B483, transparent)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Brand logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2 group">
            <img src="/logo.png" alt="Royal Zone Logo" className="h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="font-display text-2xl font-bold text-gold-500 tracking-wider">ROYAL ZONE</span>
          </Link>
          <p className="text-gray-400 text-sm mt-1">Luxury Perfumes & Bedsheets</p>
        </div>
        {children}
        <p className="text-center text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} Royal Zone. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
