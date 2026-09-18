import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * HeroSection — Cinematic split-screen luxury perfume hero.
 *
 * Desktop: Full-width 50/50 split screen (Left: Women, Right: Men).
 * Mobile/Tablet: Vertically stacked panels with central mobile badge.
 */
const HeroSection = () => {
  const [phase, setPhase] = useState(0);
  const [hovered, setHovered] = useState(null); // 'women' | 'men' | null
  const [wErr, setWErr] = useState(false);
  const [mErr, setMErr] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 80);
    const t2 = setTimeout(() => setPhase(2), 580);
    const t3 = setTimeout(() => setPhase(3), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const wDimmed = hovered === 'men';
  const mDimmed = hovered === 'women';

  // Flex sizes for hover expand/contract ONLY on desktop
  const wFlex = isDesktop
    ? (hovered === 'women' ? '0 0 60%' : hovered === 'men' ? '0 0 40%' : '0 0 50%')
    : '1 1 50%';

  const mFlex = isDesktop
    ? (hovered === 'men' ? '0 0 60%' : hovered === 'women' ? '0 0 40%' : '0 0 50%')
    : '1 1 50%';

  const panelTransition = 'flex 0.75s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <section
      id="hero"
      aria-label="Royal Zone luxury fragrance hero"
      className="relative w-full overflow-hidden select-none"
      style={{ height: '100svh', minHeight: '560px', maxHeight: '1080px' }}
    >
      {/* ══════════════════════════════════════════════════
          SPLIT PANELS
      ══════════════════════════════════════════════════ */}
      <div className="absolute inset-0 flex flex-col md:flex-row">

        {/* ─── LEFT — WOMEN ─────────────────────────────── */}
        <div
          className="relative overflow-hidden cursor-pointer"
          style={{ flex: wFlex, transition: panelTransition, minHeight: '50%' }}
          onMouseEnter={() => setHovered('women')}
          onMouseLeave={() => setHovered(null)}
        >
          {/* BG Image — mirrored so face points RIGHT toward seam */}
          <div
            className="absolute inset-0"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transition: 'opacity 1.6s ease-out',
            }}
          >
            {!wErr ? (
              <img
                src="/hero-women.png"
                alt="Royal Zone — For Her"
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'right 0%',
                  transform: `scaleX(-1) scale(${hovered === 'women' ? 1.05 : 1.0})`,
                  filter: `brightness(${wDimmed ? 0.48 : 1.0}) saturate(${wDimmed ? 0.5 : 1.0})`,
                  transition: 'transform 0.75s cubic-bezier(0.4,0,0.2,1), filter 0.65s ease',
                }}
                onError={() => setWErr(true)}
              />
            ) : (
              <div className="w-full h-full" style={{
                background: 'linear-gradient(160deg, #3B0A0A 0%, #6B1414 50%, #2D0A0A 100%)',
              }} />
            )}
          </div>

          {/* Vignettes — left-side dark, fade to transparent at seam */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to right, rgba(12,2,2,0.82) 0%, rgba(12,2,2,0.22) 35%, transparent 65%)',
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to top, rgba(8,1,1,0.88) 0%, rgba(8,1,1,0.2) 35%, transparent 60%)',
          }} />

          {/* Dim overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `rgba(0,0,0,${wDimmed ? 0.52 : 0})`,
            transition: 'background 0.65s ease',
          }} />

          {/* Crimson glow at seam edge */}
          <div className="absolute top-0 right-0 bottom-0 pointer-events-none" style={{
            width: '80px',
            background: `linear-gradient(to left, rgba(107,20,20,${hovered === 'women' ? 0.55 : 0}) 0%, transparent 100%)`,
            transition: 'background 0.6s ease',
          }} />
          <div className="absolute top-0 right-0 bottom-0 w-[2px] pointer-events-none" style={{
            background: `linear-gradient(to bottom, transparent, rgba(201,169,110,${hovered === 'women' ? 0.9 : 0.15}), transparent)`,
            boxShadow: hovered === 'women' ? '0 0 16px rgba(201,169,110,0.5), 0 0 40px rgba(201,169,110,0.2)' : 'none',
            transition: 'all 0.6s ease',
          }} />

          {/* ── WOMEN TEXT CONTENT ── */}
          <div className="absolute bottom-2 sm:bottom-0 left-0 p-3.5 sm:p-6 md:p-10 lg:p-14 z-10 flex flex-col items-start">

            {/* FOR HER tag */}
            <div
              className={`transition-all duration-700 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <p className="mb-1 sm:mb-3 text-[0.55rem] sm:text-[0.62rem]" style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.42em',
                color: wDimmed ? 'rgba(255,255,255,0.25)' : 'rgba(201,169,110,0.85)',
                textTransform: 'uppercase',
                transition: 'color 0.6s ease',
              }}>For Her</p>
            </div>

            {/* Headline */}
            <div
              className={`transition-all duration-700 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '110ms' }}
            >
              <h2 className="mb-1.5 sm:mb-4" style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.3rem, 3.5vw, 3.4rem)',
                color: wDimmed ? 'rgba(255,255,255,0.4)' : '#fff',
                lineHeight: 1.05,
                textShadow: '0 2px 28px rgba(0,0,0,0.65)',
                transition: 'color 0.6s ease',
              }}>
                Elegance,<br />
                <em style={{ color: wDimmed ? 'rgba(217,160,160,0.35)' : '#D9A0A0', transition: 'color 0.6s ease' }}>
                  bottled.
                </em>
              </h2>
            </div>

            {/* Expanding accent line */}
            <div className="mb-2 sm:mb-5" style={{
              height: '1.5px',
              width: hovered === 'women' ? '80px' : '44px',
              background: 'linear-gradient(90deg, rgba(201,169,110,0.85), transparent)',
              transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)',
              opacity: wDimmed ? 0.2 : 1,
            }} />

            {/* CTA */}
            <div
              className={`transition-all duration-700 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Link
                to="/perfumes?gender=women"
                className="group inline-flex items-center gap-2 sm:gap-3"
                style={{ opacity: wDimmed ? 0.35 : 1, transition: 'opacity 0.6s ease' }}
              >
                <span className="px-4 py-1.5 sm:px-6 sm:py-2.5 text-[0.55rem] sm:text-[0.6rem]" style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  border: `1px solid rgba(201,169,110,${hovered === 'women' ? 0.7 : 0.28})`,
                  background: hovered === 'women'
                    ? 'rgba(107,20,20,0.55)'
                    : 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  display: 'block',
                  boxShadow: hovered === 'women' ? '0 0 24px rgba(107,20,20,0.45), inset 0 0 16px rgba(201,169,110,0.08)' : 'none',
                  transition: 'all 0.45s ease',
                }}>
                  Shop Women
                </span>
                <span style={{
                  color: 'rgba(201,169,110,0.7)',
                  fontSize: '1rem',
                  fontWeight: 300,
                  transform: hovered === 'women' ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.35s ease',
                  display: 'inline-block',
                }}>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── RIGHT — MEN ─────────────────────────────── */}
        <div
          className="relative overflow-hidden cursor-pointer"
          style={{ flex: mFlex, transition: panelTransition, minHeight: '50%' }}
          onMouseEnter={() => setHovered('men')}
          onMouseLeave={() => setHovered(null)}
        >
          {/* BG Image — mirrored so face points LEFT toward seam */}
          <div
            className="absolute inset-0"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transition: 'opacity 1.6s ease-out 0.12s',
            }}
          >
            {!mErr ? (
              <img
                src="/hero-men.png"
                alt="Royal Zone — For Him"
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'left 0%',
                  transform: `scaleX(-1) scale(${hovered === 'men' ? 1.05 : 1.0})`,
                  filter: `brightness(${mDimmed ? 0.48 : 1.0}) saturate(${mDimmed ? 0.5 : 1.0})`,
                  transition: 'transform 0.75s cubic-bezier(0.4,0,0.2,1), filter 0.65s ease',
                }}
                onError={() => setMErr(true)}
              />
            ) : (
              <div className="w-full h-full" style={{
                background: 'linear-gradient(200deg, #050505 0%, #141414 50%, #060606 100%)',
              }} />
            )}
          </div>

          {/* Vignettes */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to left, rgba(4,4,4,0.82) 0%, rgba(4,4,4,0.22) 35%, transparent 65%)',
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to top, rgba(3,3,3,0.88) 0%, rgba(3,3,3,0.2) 35%, transparent 60%)',
          }} />

          {/* Dim overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `rgba(0,0,0,${mDimmed ? 0.52 : 0})`,
            transition: 'background 0.65s ease',
          }} />

          {/* Silver/white glow at seam edge */}
          <div className="absolute top-0 left-0 bottom-0 pointer-events-none" style={{
            width: '80px',
            background: `linear-gradient(to right, rgba(28,28,28,${hovered === 'men' ? 0.55 : 0}) 0%, transparent 100%)`,
            transition: 'background 0.6s ease',
          }} />
          <div className="absolute top-0 left-0 bottom-0 w-[2px] pointer-events-none" style={{
            background: `linear-gradient(to bottom, transparent, rgba(201,169,110,${hovered === 'men' ? 0.9 : 0.15}), transparent)`,
            boxShadow: hovered === 'men' ? '0 0 16px rgba(201,169,110,0.5), 0 0 40px rgba(201,169,110,0.2)' : 'none',
            transition: 'all 0.6s ease',
          }} />

          {/* ── MEN TEXT CONTENT ── */}
          <div className="absolute bottom-2 sm:bottom-0 right-0 p-3.5 sm:p-6 md:p-10 lg:p-14 z-10 flex flex-col items-end text-right max-w-[280px] sm:max-w-[340px] md:max-w-[380px]">

            {/* FOR HIM tag */}
            <div
              className={`transition-all duration-700 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '80ms' }}
            >
              <p className="mb-1 sm:mb-3 text-[0.55rem] sm:text-[0.62rem]" style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.42em',
                color: mDimmed ? 'rgba(255,255,255,0.25)' : 'rgba(201,169,110,0.85)',
                textTransform: 'uppercase',
                transition: 'color 0.6s ease',
              }}>For Him</p>
            </div>

            {/* Headline */}
            <div
              className={`transition-all duration-700 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '180ms' }}
            >
              <h2 className="mb-1.5 sm:mb-4" style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                fontSize: 'clamp(1.3rem, 3.2vw, 2.8rem)',
                color: mDimmed ? 'rgba(255,255,255,0.4)' : '#fff',
                lineHeight: 1.08,
                textShadow: '0 2px 28px rgba(0,0,0,0.9)',
                transition: 'color 0.6s ease',
              }}>
                Bold.<br />
                Distinctive.<br />
                <em style={{ color: mDimmed ? 'rgba(176,176,176,0.35)' : '#C8C8C8', transition: 'color 0.6s ease' }}>
                  Timeless.
                </em>
              </h2>
            </div>

            {/* Expanding accent line */}
            <div className="mb-2 sm:mb-5" style={{
              height: '1.5px',
              width: hovered === 'men' ? '80px' : '44px',
              background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.85))',
              transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)',
              opacity: mDimmed ? 0.2 : 1,
            }} />

            {/* CTA */}
            <div
              className={`transition-all duration-700 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Link
                to="/perfumes?gender=men"
                className="group inline-flex items-center gap-2 sm:gap-3"
                style={{ opacity: mDimmed ? 0.35 : 1, transition: 'opacity 0.6s ease' }}
              >
                <span style={{
                  color: 'rgba(201,169,110,0.7)',
                  fontSize: '1rem',
                  fontWeight: 300,
                  transform: hovered === 'men' ? 'translateX(-4px)' : 'translateX(0)',
                  transition: 'transform 0.35s ease',
                  display: 'inline-block',
                }}>←</span>
                <span className="px-4 py-1.5 sm:px-6 sm:py-2.5 text-[0.55rem] sm:text-[0.6rem]" style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  border: `1px solid rgba(201,169,110,${hovered === 'men' ? 0.7 : 0.28})`,
                  background: hovered === 'men'
                    ? 'rgba(20,20,20,0.65)'
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                  display: 'block',
                  boxShadow: hovered === 'men' ? '0 0 24px rgba(255,255,255,0.08), inset 0 0 16px rgba(201,169,110,0.05)' : 'none',
                  transition: 'all 0.45s ease',
                }}>
                  Shop Men
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CENTER DIVIDER — DESKTOP
      ══════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex absolute top-0 bottom-0 z-30 flex-col items-center justify-center pointer-events-none"
        style={{ left: '50%', transform: 'translateX(-50%)', width: '0px' }}
      >
        {/* Top gold line */}
        <div
          className={`transition-all duration-1000 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div style={{
            width: '1px',
            height: '130px',
            background: `linear-gradient(to bottom, transparent, rgba(201,169,110,${hovered ? 0.9 : 0.45}))`,
            transition: 'background 0.5s ease',
            boxShadow: hovered ? '0 0 8px rgba(201,169,110,0.4)' : 'none',
          }} />
        </div>

        {/* Logo badge — centered at seam */}
        <div
          className={`transition-all duration-700 ${phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px 28px',
            gap: '11px',
            background: 'rgba(0,0,0,0.65)',
            border: `1px.5px solid rgba(201,169,110,${hovered ? 0.75 : 0.35})`,
            backdropFilter: 'blur(24px)',
            boxShadow: hovered
              ? `0 0 50px rgba(201,169,110,0.3), 0 0 90px rgba(201,169,110,0.15), inset 0 0 24px rgba(201,169,110,0.08)`
              : '0 10px 48px rgba(0,0,0,0.65)',
            transition: 'all 0.55s ease',
            minWidth: '130px',
          }}>
            {/* Half crimson / half charcoal background gradient inside badge */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: hovered === 'women'
                ? 'linear-gradient(135deg, rgba(107,20,20,0.28), rgba(0,0,0,0.1))'
                : hovered === 'men'
                ? 'linear-gradient(225deg, rgba(28,28,28,0.45), rgba(0,0,0,0.1))'
                : 'transparent',
              transition: 'background 0.6s ease',
              pointerEvents: 'none',
            }} />

            <img
              src="/logo.png"
              alt="Royal Zone"
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                opacity: 0.98,
                position: 'relative',
                zIndex: 1,
              }}
            />
            <p style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: '0.38em',
              color: '#fff',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}>
              ROYAL ZONE
            </p>
            <div style={{
              width: '36px',
              height: '1px',
              background: `rgba(201,169,110,${hovered ? 0.85 : 0.45})`,
              transition: 'background 0.5s ease',
            }} />
            <p style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: '0.48rem',
              letterSpacing: '0.22em',
              color: `rgba(201,169,110,${hovered ? 0.95 : 0.65})`,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              transition: 'color 0.5s ease',
            }}>
              The Scent of Royalty
            </p>
          </div>
        </div>

        {/* Bottom gold line */}
        <div
          className={`transition-all duration-1000 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div style={{
            width: '1px',
            height: '130px',
            background: `linear-gradient(to top, transparent, rgba(201,169,110,${hovered ? 0.9 : 0.45}))`,
            transition: 'background 0.5s ease',
            boxShadow: hovered ? '0 0 8px rgba(201,169,110,0.4)' : 'none',
          }} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE — Brand emblem badge between stacked panels
      ══════════════════════════════════════════════════ */}
      <div
        className={`md:hidden absolute z-20 flex justify-center transition-all duration-700 ${phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        style={{
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          transitionDelay: '200ms',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '9px',
          padding: '7px 18px',
          background: 'rgba(5,5,5,0.85)',
          border: '1px solid rgba(201,169,110,0.45)',
          backdropFilter: 'blur(20px)',
          borderRadius: '99px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 16px rgba(201,169,110,0.15)',
        }}>
          <div style={{ width: '22px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.75))' }} />
          <img src="/logo.png" alt="Royal Zone" style={{ width: '18px', height: '18px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.95 }} />
          <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '0.48rem', letterSpacing: '0.32em', color: '#fff', whiteSpace: 'nowrap' }}>
            ROYAL ZONE
          </p>
          <div style={{ width: '22px', height: '1px', background: 'linear-gradient(90deg, rgba(201,169,110,0.75), transparent)' }} />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className={`hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1.5 pointer-events-none transition-all duration-700 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '700ms' }}
      >
        <div style={{
          width: '1px',
          height: '28px',
          background: `rgba(201,169,110,${hovered ? 0.7 : 0.35})`,
          animation: 'subtlePulse 2.5s ease-in-out infinite',
          transition: 'background 0.4s ease',
        }} />
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '0.48rem',
          letterSpacing: '0.3em',
          color: `rgba(201,169,110,${hovered ? 0.7 : 0.35})`,
          textTransform: 'uppercase',
          transition: 'color 0.4s ease',
        }}>Scroll</p>
      </div>
    </section>
  );
};

export default HeroSection;
