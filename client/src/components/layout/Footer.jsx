import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const categories = [
    { label: 'Perfumes', to: '/perfumes' },
    { label: 'Bedsheets', to: '/bedsheets' },
    { label: 'New Arrivals', to: '/perfumes?filter=new' },
    { label: 'Best Sellers', to: '/perfumes?filter=bestseller' },
    { label: 'Luxury Collection', to: '/perfumes?filter=luxury' },
  ];

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Cart', to: '/cart' },
  ];

  const socialLinks = [
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'Pinterest',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-navy-900 dark:bg-navy-900 text-gray-300">
      {/* Top decorative border */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 font-display text-2xl font-bold text-gold-500 mb-4 group">
              <img src="/logo.png" alt="Royal Zone Logo" className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              <span>ROYAL ZONE</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Elevating everyday living with premium perfumes and luxury bedsheets. Experience the art of refined living.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-navy-800 border border-gray-700 hover:border-gold-500 hover:text-gold-500 hover:bg-gold-500/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-white font-semibold mb-5 text-lg">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c.label}>
                  <Link
                    to={c.to}
                    className="text-sm text-gray-400 hover:text-gold-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white font-semibold mb-5 text-lg">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-gray-400 hover:text-gold-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-display text-white font-semibold mb-5 text-lg">Contact Us</h4>
            <ul className="space-y-3 mb-7 text-sm text-gray-400">
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Lahore, Pakistan
              </li>
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +92 336 7947525
              </li>
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                saimlinkedin0000@gmail.com
              </li>
            </ul>

            {/* Newsletter */}
            <h4 className="font-display text-white font-semibold mb-3 text-base">Newsletter</h4>
            {subscribed ? (
              <p className="text-green-400 text-sm font-medium">✓ Subscribed! Thank you.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm bg-navy-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-gold"
                  style={{ background: 'linear-gradient(135deg, #C9A96E, #B8955A)' }}
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }} />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Royal Zone. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-gold-500 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-gold-500 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-gold-500 transition-colors">Support</Link>
          </div>
          {/* Payment icons text */}
          <div className="flex items-center gap-2 text-gray-600">
            <span>💳</span>
            <span>🏦</span>
            <span>💵</span>
            <span>COD Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
