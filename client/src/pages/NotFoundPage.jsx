import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="pt-20 min-h-screen bg-cream-50 dark:bg-navy-900 flex items-center justify-center px-4">
    <div className="text-center max-w-lg animate-fade-in">
      {/* Crown animation */}
      <div className="text-8xl md:text-9xl mb-6 animate-float select-none">👑</div>
      <h1 className="font-display text-8xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #C9A96E, #D4B483)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        404
      </h1>
      <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
        The royal page you're looking for seems to have vanished. Perhaps it was moved or never existed. Let us guide you back to luxury.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link to="/" className="btn-primary px-8 py-3">
          🏠 Go Home
        </Link>
        <Link to="/perfumes" className="btn-secondary px-8 py-3">
          Shop Collections
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
