import React from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../product/ProductGrid';
import useScrollReveal from '../../hooks/useScrollReveal';

/**
 * GenderCollectionSection
 * FOR HER: Deep Royal Velvet Burgundy & Rose-Gold theme
 * FOR HIM: Obsidian Midnight Slate & Polished Gold theme
 */
const GenderCollectionSection = ({ gender = 'women', products = [] }) => {
  const { ref: headingRef, isVisible: headingVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();

  const isWomen = gender === 'women';

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 border-t border-b border-gold-500/20"
      aria-label={`${isWomen ? "Women's" : "Men's"} fragrance collection`}
      style={{
        background: isWomen
          ? 'linear-gradient(145deg, #1A0306 0%, #340910 40%, #480D16 70%, #1F0407 100%)'
          : 'linear-gradient(145deg, #06080C 0%, #101520 40%, #182030 70%, #0A0D14 100%)',
      }}
    >
      {/* Subtle glowing ambient orb in background */}
      <div
        className="absolute pointer-events-none rounded-full blur-3xl opacity-25"
        style={{
          width: '500px',
          height: '500px',
          top: '-100px',
          right: isWomen ? '-100px' : 'auto',
          left: isWomen ? 'auto' : '-100px',
          background: isWomen ? '#8B1E2D' : '#1E3A8A',
        }}
      />

      {/* Subtle noise/grain overlay for "matte velvet" feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
          mixBlendMode: 'overlay',
        }}
      />

      <div className="container-custom relative z-10">

        {/* Section header */}
        <div
          ref={headingRef}
          className={`mb-10 sm:mb-14 transition-all duration-700 ${headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 mb-3">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: isWomen ? '#E6A8A8' : '#C9A96E' }} />
            <p
              className="font-bold uppercase text-[10px] tracking-[0.35em]"
              style={{ color: isWomen ? '#F2C4C4' : '#D4B483' }}
            >
              {isWomen ? 'For Her Collection' : 'For Him Collection'}
            </p>
          </div>

          {/* Main title */}
          <h2
            className="font-display font-bold leading-none mb-4 text-white tracking-tight"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
            }}
          >
            {isWomen ? (
              <>
                FOR HER <span className="italic font-normal font-serif text-rose-300/90 ml-2">Elegance</span>
              </>
            ) : (
              <>
                FOR HIM <span className="italic font-normal font-serif text-amber-200/90 ml-2">Presence</span>
              </>
            )}
          </h2>

          {/* Accent divider */}
          <div
            className="h-[2px] w-20 mb-6"
            style={{
              background: isWomen
                ? 'linear-gradient(90deg, #E6A8A8, #C9A96E, transparent)'
                : 'linear-gradient(90deg, #C9A96E, #94A3B8, transparent)',
            }}
          />

          {/* Subtitle + CTA row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <p
              className="text-sm sm:text-base font-light leading-relaxed"
              style={{
                maxWidth: '32rem',
                color: isWomen ? 'rgba(255, 230, 230, 0.82)' : 'rgba(226, 232, 240, 0.82)',
              }}
            >
              {isWomen
                ? 'Sensual florals, velvet amber, and timeless grace crafted to leave an unforgettable aura.'
                : 'Smoky woods, rare oud, and bold spices forged for the distinguished gentleman.'}
            </p>
            <Link
              to={isWomen ? '/perfumes?gender=women' : '/perfumes?gender=men'}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold px-5 py-2.5 rounded-none border transition-all duration-300 group shrink-0"
              style={{
                color: '#FFFFFF',
                borderColor: 'rgba(201, 169, 110, 0.4)',
                background: isWomen ? 'rgba(89, 16, 26, 0.6)' : 'rgba(16, 21, 32, 0.6)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span>{isWomen ? "Shop Women's" : "Shop Men's"}</span>
              <span className="text-gold-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Product grid */}
        <div
          ref={gridRef}
          className={`transition-all duration-700 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <ProductGrid products={products.slice(0, 4)} />
        </div>

      </div>
    </section>
  );
};

export default GenderCollectionSection;
