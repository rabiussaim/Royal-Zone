import React from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';

/**
 * ComingSoonSection
 * Premium "Bedsheet Collection — Coming Soon" section.
 * Appears near the bottom of the homepage, after perfume-focused content.
 * Elegant, minimal — does NOT look like an active product category.
 */
const ComingSoonSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#F9F7F5' }}
      aria-label="Bedsheet collection coming soon"
    >
      {/* Dark theme variant */}
      <div className="dark:hidden" />

      {/* Content */}
      <div
        ref={ref}
        className={`container-custom py-20 md:py-28 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-2xl mx-auto text-center">

          {/* Coming Soon badge */}
          <div className="inline-flex items-center justify-center mb-8">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.4em] px-4 py-2 border"
              style={{
                color: '#888',
                borderColor: 'rgba(0,0,0,0.12)',
                letterSpacing: '0.35em',
              }}
            >
              Coming Soon
            </span>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-16" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A96E' }} />
            <div className="h-[1px] w-16" style={{ background: 'linear-gradient(90deg, #C9A96E, transparent)' }} />
          </div>

          {/* Title */}
          <h2
            className="font-display font-bold text-gray-900 dark:text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.01em' }}
          >
            Bedsheet Collection
          </h2>

          <p
            className="font-display italic text-gray-400 dark:text-gray-500 mb-6"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}
          >
            Luxury sleep, redefined.
          </p>

          <div className="h-[1px] w-12 mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />

          <p
            className="text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-10"
            style={{ maxWidth: '28rem', margin: '0 auto 2.5rem' }}
          >
            Our curated collection of premium Egyptian cotton and silk bedsheets 
            is being carefully prepared. Crafted for exceptional comfort — arriving soon.
          </p>

          {/* CTA */}
          <Link
            to="/bedsheets"
            className="inline-flex items-center gap-3 group"
          >
            <span
              className="text-[11px] font-bold uppercase tracking-[0.22em] border px-8 py-3.5 transition-all duration-300 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900"
              style={{ color: '#888', borderColor: 'rgba(0,0,0,0.2)' }}
            >
              Discover Soon
            </span>
          </Link>

        </div>
      </div>

      {/* Subtle background — light cream with faint textile pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.025'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px',
        }}
      />
    </section>
  );
};

export default ComingSoonSection;
