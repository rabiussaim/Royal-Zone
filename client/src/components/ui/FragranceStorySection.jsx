import React from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';

/**
 * FragranceStorySection
 * Premium editorial brand identity / storytelling section.
 * Appears after the product grids, before testimonials.
 */
const FragranceStorySection = () => {
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal();
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal();

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#050505' }}
      aria-label="Royal Zone fragrance story"
    >
      <div className="container-custom py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left — editorial text */}
          <div
            ref={leftRef}
            className={`transition-all duration-1000 ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.35em] mb-6"
              style={{ color: 'rgba(201,169,110,0.7)' }}
            >
              Our Philosophy
            </p>

            <h2
              className="font-display font-bold text-white leading-[1.1] mb-8"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)' }}
            >
              Crafted for
              <span className="block italic" style={{ color: '#D9A0A0' }}>those who</span>
              leave a mark.
            </h2>

            <div
              className="h-[1px] w-12 mb-8"
              style={{ background: 'linear-gradient(90deg, #C9A96E, transparent)' }}
            />

            <p
              className="text-gray-400 leading-relaxed mb-6 font-light"
              style={{ fontSize: '1.05rem', maxWidth: '36rem' }}
            >
              Every Royal Zone fragrance is an act of deliberate creation — rare ingredients, 
              selected by master perfumers, distilled into a scent identity that is entirely yours.
            </p>

            <p
              className="text-gray-500 leading-relaxed mb-10 font-light"
              style={{ maxWidth: '36rem' }}
            >
              From the warm depth of Oud to the ethereal lift of Bulgarian rose — 
              each bottle carries a story that begins the moment you wear it.
            </p>

            <Link
              to="/perfumes"
              className="inline-flex items-center gap-3 group"
            >
              <span
                className="text-xs font-bold uppercase tracking-[0.22em] border px-6 py-3 transition-all duration-300 group-hover:bg-white group-hover:text-gray-900"
                style={{
                  color: '#C9A96E',
                  borderColor: 'rgba(201,169,110,0.4)',
                  background: 'rgba(201,169,110,0.05)',
                }}
              >
                Explore All Fragrances
              </span>
              <span
                className="text-sm transition-all duration-300 group-hover:translate-x-1"
                style={{ color: '#C9A96E' }}
              >
                →
              </span>
            </Link>
          </div>

          {/* Right — editorial image / visual */}
          <div
            ref={rightRef}
            className={`transition-all duration-1000 ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="relative">
              {/* Main editorial image */}
              <div
                className="w-full aspect-[3/4] overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #1A0808 0%, #2D1010 40%, #0A0505 100%)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&w=800&q=80"
                  alt="Royal Zone luxury fragrance editorial"
                  className="w-full h-full object-cover opacity-75 mix-blend-luminosity"
                  style={{ transition: 'transform 0.8s ease', objectPosition: 'center top' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Floating quote card */}
              <div
                className="absolute -bottom-6 -left-6 max-w-[220px] p-5"
                style={{
                  background: 'rgba(201,169,110,0.06)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p
                  className="font-display italic text-white leading-snug mb-3"
                  style={{ fontSize: '1rem' }}
                >
                  "A fragrance is the last accessory you put on,
                  but the first thing people remember."
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: 'rgba(201,169,110,0.6)' }}
                >
                  Royal Zone Atelier
                </p>
              </div>

              {/* Vertical accent bar */}
              <div
                className="absolute top-0 -right-4 w-[2px] h-2/3"
                style={{ background: 'linear-gradient(to bottom, #C9A96E, transparent)' }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />
    </section>
  );
};

export default FragranceStorySection;
