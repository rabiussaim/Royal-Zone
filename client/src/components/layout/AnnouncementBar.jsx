import React from 'react';

const AnnouncementBar = ({ visible = true, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-9 w-full overflow-hidden shadow-sm"
      style={{
        background: 'linear-gradient(90deg, #0A0F1E 0%, #1A233A 40%, #0A0F1E 100%)',
        borderBottom: '1px solid rgba(201, 169, 110, 0.3)',
      }}
    >
      <div className="h-full flex items-center justify-center relative px-8">
        {/* Scrolling Text Marquee */}
        <div className="announcement-scroll flex items-center gap-10 whitespace-nowrap text-xs font-semibold tracking-wider uppercase">
          <span className="flex items-center gap-2">
            <span className="text-amber-400">🚚 FREE EXPRESS DELIVERY</span>
            <span className="text-gray-300">ON ALL ORDERS ACROSS PAKISTAN</span>
          </span>
          <span className="text-gold-500">✦</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">💵 CASH ON DELIVERY</span>
            <span className="text-gray-300">NO MINIMUM ORDER REQUIRED</span>
          </span>
          <span className="text-gold-500">✦</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">👑 ROYAL ZONE LUXURY</span>
            <span className="text-gray-300">100% PREMIUM GUARANTEE</span>
          </span>
          <span className="text-gold-500">✦</span>

          {/* Repeat for seamless loop */}
          <span className="flex items-center gap-2">
            <span className="text-amber-400">🚚 FREE EXPRESS DELIVERY</span>
            <span className="text-gray-300">ON ALL ORDERS ACROSS PAKISTAN</span>
          </span>
          <span className="text-gold-500">✦</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">💵 CASH ON DELIVERY</span>
            <span className="text-gray-300">NO MINIMUM ORDER REQUIRED</span>
          </span>
          <span className="text-gold-500">✦</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">👑 ROYAL ZONE LUXURY</span>
            <span className="text-gray-300">100% PREMIUM GUARANTEE</span>
          </span>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
            title="Dismiss banner"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBar;
