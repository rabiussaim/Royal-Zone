import React from 'react';

// Star rating display component
const StarRating = ({ rating = 0, count = null, size = 'md' }) => {
  const starSizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const starSize = starSizes[size] || starSizes.md;

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push('full');
    } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((type, idx) => (
          <svg key={idx} className={`${starSize} ${type !== 'empty' ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} fill={type === 'empty' ? 'none' : 'currentColor'} stroke="currentColor" viewBox="0 0 24 24">
            {type === 'half' ? (
              <defs>
                <linearGradient id={`half-${idx}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
                <path fill={`url(#half-${idx})`} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </defs>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={type === 'empty' ? 1.5 : 0} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            )}
          </svg>
        ))}
      </div>
      {count !== null && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
