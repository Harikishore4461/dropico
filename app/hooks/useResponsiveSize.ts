'use client';

import { useState, useEffect } from 'react';

interface ResponsiveSize {
  width: number;
  height: number;
  marginBottom: number;
}

export const useResponsiveSize = (): ResponsiveSize => {
  const [size, setSize] = useState<ResponsiveSize>({
    width: 0,
    height: 0,
    marginBottom: 0
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }
    const calculateSize = () => {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        return;
      }
      
      const { innerWidth, innerHeight } = window;
      
      // Base calculations
      const viewportWidth = innerWidth;
      const viewportHeight = innerHeight;
      
      // Calculate logo size based on viewport
      let logoWidth: number;
      let logoHeight: number;
      let marginBottom: number;
      
             if (viewportWidth >= 1200) {
         // Desktop
         logoWidth = 800;
         logoHeight = 800;
         marginBottom = 10;
       } else if (viewportWidth >= 820) {
         // iPad
         logoWidth = 700;
         logoHeight = 700;
         marginBottom = Math.max(viewportHeight * 0.25, 100);
       } else if (viewportWidth >= 480) {
         // Mobile landscape
         logoWidth = 600;
         logoHeight = 600;
         marginBottom = Math.max(viewportHeight * 0.2, 80);
       } else {
         // Mobile portrait
         logoWidth = 500;
         logoHeight = 500;
         marginBottom = Math.max(viewportHeight * 0.15, 60);
       }
      
             // Fixed sizes - no constraints needed
      
      const newSize = {
        width: Math.round(logoWidth),
        height: Math.round(logoHeight),
        marginBottom: Math.round(marginBottom)
      };
      
      setSize(newSize);
    };

    // Calculate initial size immediately
    calculateSize();
    
    // Add debounced resize listener
    let resizeTimeout: NodeJS.Timeout;
    const debouncedCalculateSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateSize, 100);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', debouncedCalculateSize);
    }
    
    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', debouncedCalculateSize);
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  return size;
};
