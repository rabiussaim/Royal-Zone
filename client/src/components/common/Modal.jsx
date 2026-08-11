import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-screen-xl' };

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose?.();
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className={`relative w-full ${sizes[size]} bg-white dark:bg-navy-800 rounded-2xl shadow-luxury modal-content overflow-hidden`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {/* Body */}
        <div className="overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
