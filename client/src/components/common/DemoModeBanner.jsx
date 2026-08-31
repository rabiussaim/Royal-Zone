import React, { useState } from 'react';
import { STORE_CONFIG } from '../../config/storeConfig';

// ─── Fixed header stack offsets (mirrors Navbar.jsx positioning) ──────────────
// AnnouncementBar:  fixed top-0    z-[60]  h-9 = 36px
// Navbar:           fixed top-9    z-50    h ≈ 56px  (py-1.5 + logo h-12)
// DemoModeBanner:   fixed top-92px z-[45]  (slots in just below navbar)
// The invisible spacer div below the fixed banner pushes page content down.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DemoModeBanner
 *
 * A fixed, premium "Collection Coming Soon" strip that appears directly below
 * the existing Royal Zone Navbar. The Navbar is NEVER modified by this component.
 *
 * Turning off: set IS_DEMO_MODE: false in src/config/storeConfig.js.
 * The banner and its spacer disappear completely — no other code changes needed.
 */
const DemoModeBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (!STORE_CONFIG.IS_DEMO_MODE || dismissed) return null;

  return (
    <>
      {/* ── Fixed banner strip ─────────────────────────────────────────────── */}
      <div
        aria-label="Site announcement"
        style={{
          position: 'fixed',
          top: '92px',       // AnnouncementBar (36px) + Navbar (~56px)
          left: 0,
          right: 0,
          zIndex: 45,        // below Navbar (z-50) and AnnouncementBar (z-60)
          background: 'linear-gradient(90deg, #06091a 0%, #0e1628 45%, #06091a 100%)',
          borderTop: '1px solid rgba(201, 169, 110, 0.10)',
          borderBottom: '1px solid rgba(201, 169, 110, 0.28)',
        }}
      >
        {/* Ambient gold glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 50% 80% at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '13px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '7px',
            textAlign: 'center',
          }}
        >
          {/* Title row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '15px' }}>👑</span>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '13px',
                fontWeight: '700',
                color: '#C9A96E',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Royal Zone — Collection Coming Soon
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 9px',
                fontSize: '9.5px',
                fontWeight: '700',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                borderRadius: '999px',
                background: 'rgba(201,169,110,0.11)',
                border: '1px solid rgba(201,169,110,0.25)',
                color: '#D4B483',
              }}
            >
              Under Development
            </span>
          </div>

          {/* Body message */}
          <p
            style={{
              fontSize: '12px',
              lineHeight: '1.65',
              color: 'rgba(209,213,219,0.88)',
              maxWidth: '780px',
              margin: 0,
            }}
          >
            Welcome to the Royal Zone online store. We're currently preparing our official perfume
            collection for launch. The products currently displayed are{' '}
            <span style={{ fontWeight: '500', color: 'rgba(212,180,131,0.92)' }}>
              demo products
            </span>{' '}
            used for preview purposes only. Our authentic Royal Zone collection will be available soon.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1px' }}>
            {/* Stay Tuned CTA */}
            <button
              type="button"
              style={{
                padding: '5px 18px',
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #C9A96E 0%, #D4B483 100%)',
                color: '#06091a',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.82')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Stay Tuned
            </button>

            {/* Dismiss */}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss this notice"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: '1px solid rgba(201,169,110,0.20)',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(156,163,175,0.70)',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(156,163,175,0.70)')}
            >
              Dismiss
              <svg width="9" height="9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Invisible spacer ───────────────────────────────────────────────────
          Pushes the first page section down so it isn't hidden behind the
          fixed banner. Height matches the banner's rendered height (~110px).
          When dismissed (or IS_DEMO_MODE is false), this spacer also disappears.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ height: '110px', width: '100%', flexShrink: 0 }}
      />
    </>
  );
};

export default DemoModeBanner;
