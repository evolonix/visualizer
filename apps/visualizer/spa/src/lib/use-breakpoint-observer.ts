import { useEffect, useState } from 'react';

/**
 * Observe a media query.
 */
export const useBreakpointObserver = (width: string | number) => {
  const value = typeof width === 'string' ? width : `${width}px`;
  const mediaQuery = window.matchMedia(`(min-width: ${value})`);
  const [isMatch, setIsMatch] = useState(mediaQuery.matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${value})`);

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsMatch(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [value]);

  return isMatch;
};
