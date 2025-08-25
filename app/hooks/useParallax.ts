import { useEffect, useRef, useState } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  enabled?: boolean;
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'down', enabled = true } = options;
  const elementRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (elementRef.current) {
        const element = elementRef.current;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + currentScrollY;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate parallax effect
        const scrolled = currentScrollY - elementTop + windowHeight;
        const rate = scrolled * speed;
        
        // Apply transform based on direction
        const transform = direction === 'up' 
          ? `translateY(${rate}px)`
          : `translateY(${-rate}px)`;

        element.style.transform = transform;
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [speed, direction, enabled]);

  return elementRef;
};

// Hook for hero background parallax
export const useHeroParallax = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Simple parallax effect for background (moves slower than scroll)
      if (backgroundRef.current) {
        const background = backgroundRef.current;
        const rate = scrollY * 0.3;
        background.style.transform = `translateY(${rate}px)`;
      }

      // Simple parallax effect for content (moves opposite direction)
      if (contentRef.current) {
        const content = contentRef.current;
        const rate = scrollY * 0.1;
        content.style.transform = `translateY(${-rate}px)`;
      }
    };

    // Use a more efficient throttling approach
    let rafId: number;
    const throttledHandleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return { backgroundRef, contentRef };
};
