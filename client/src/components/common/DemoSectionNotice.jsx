import React from 'react';
import { STORE_CONFIG } from '../../config/storeConfig';

/**
 * DemoSectionNotice
 * ─────────────────────────────────────────────────────────────────────────────
 * A subtle, premium notice to place above product grids on catalog pages
 * (Perfumes, Bedsheets, Search, HomePage sections).
 * Renders nothing when IS_DEMO_MODE is false — zero cleanup needed at launch.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const DemoSectionNotice = () => {
  if (!STORE_CONFIG.IS_DEMO_MODE) return null;

  return (
    <div
      className="w-full rounded-2xl mb-8 px-5 py-4 flex flex-col sm:flex-row items-center sm:items-start gap-3.5"
      style={{
        background: 'linear-gradient(135deg, rgba(10,15,30,0.96) 0%, rgba(17,24,39,0.96) 100%)',
        border: '1px solid rgba(201,169,110,0.22)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Icon */}
      <div
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base"
        style={{
          background: 'rgba(201,169,110,0.10)',
          border: '1px solid rgba(201,169,110,0.25)',
        }}
      >
        🧪
      </div>

      {/* Text */}
      <div className="text-center sm:text-left space-y-0.5">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: '#C9A96E' }}
          >
            Temporary Showcase
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#C9A96E' }}
          />
        </div>
        <p
          className="text-xs sm:text-sm leading-relaxed"
          style={{ color: 'rgba(209,213,219,0.85)' }}
        >
          The items displayed below are{' '}
          <span style={{ color: '#D4B483' }} className="font-medium">
            demo products
          </span>{' '}
          used for site testing and preview. Our official Royal Zone collection will be available very soon.
        </p>
      </div>
    </div>
  );
};

export default DemoSectionNotice;
