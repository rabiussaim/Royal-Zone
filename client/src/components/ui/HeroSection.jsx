import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Large luxury hero section for the home page
const HeroSection = () => {
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background image & gradient fallback */}
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury hero background"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Fallback & Dark Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: imgError
              ? 'radial-gradient(ellipse at center, #1A2238 0%, #0A0F1E 70%, #050811 100%)'
              : 'linear-gradient(135deg, rgba(10, 15, 30, 0.85) 0%, rgba(10, 15, 30, 0.70) 50%, rgba(10, 15, 30, 0.85) 100%)',
          }}
        />

        {/* Decorative Gold Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(201, 169, 110, 0.15) 0%, transparent 60%)',
          }}
        />

        {/* Gold gradient bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream-50 dark:from-navy-900 to-transparent" />
      </div>

      {/* Floating decorative orbs */}
      <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full opacity-20 animate-float blur-3xl" style={{ background: 'radial-gradient(circle, #C9A96E, transparent)' }} />
      <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-full opacity-15 animate-float-reverse blur-2xl" style={{ background: 'radial-gradient(circle, #D4B483, transparent)' }} />

      {/* Main Hero Content */}
      <div className="relative z-10 container-custom text-center px-4 max-w-5xl">
        {/* Main headline */}
        <h1
          className={`font-display text-white mb-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)', lineHeight: '1.1', textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
        >
          Discover the Art of{' '}
          <span
            className="block mt-2"
            style={{
              background: 'linear-gradient(135deg, #F3E5AB 0%, #D4B483 30%, #C9A96E 60%, #B8955A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Luxury Living
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          Premium perfumes crafted from rare ingredients and luxury bedsheets woven from the finest threads — because you deserve nothing but the best.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <Link
            to="/perfumes"
            className="btn-primary px-10 py-4 text-base shadow-gold hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Perfumes
          </Link>
          <Link
            to="/bedsheets"
            className="btn-secondary px-10 py-4 text-base text-white border-white hover:bg-white hover:text-navy-900"
          >
            Explore Bedsheets
          </Link>
        </div>

        {/* Stats */}
        <div
          className={`mt-16 flex flex-wrap justify-center gap-8 md:gap-16 transition-all duration-700 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {[
            ['1000+', 'Happy Customers'],
            ['40+', 'Luxury Products'],
            ['5★', 'Average Rating'],
            ['15+', 'Countries Served'],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-bold text-gold-500">{num}</div>
              <div className="text-gray-300 text-sm mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-float hidden sm:block">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
          <div className="w-1 h-2.5 bg-white/70 rounded-full animate-slide-down" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
