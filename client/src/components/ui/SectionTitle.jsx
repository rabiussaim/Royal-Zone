import React from 'react';

// Reusable section title with gold accent line and optional subtitle
const SectionTitle = ({ title, subtitle, centered = true, light = false }) => (
  <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
    <h2 className={`section-title ${light ? '!text-white' : ''}`}>{title}</h2>
    <div className={`gold-line ${centered ? 'mx-auto' : 'ml-0'}`} />
    {subtitle && (
      <p className={`mt-4 text-base max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionTitle;
