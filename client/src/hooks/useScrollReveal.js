import { useEffect, useRef, useState } from 'react';

// Reveals element when it enters the viewport using IntersectionObserver
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // Only trigger once
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

export default useScrollReveal;
