// React Simple Kit - Mobile Accessibility Hooks
// https://react-simplikit.slash.page/ko/mobile/intro.html

import { useCallback, useEffect, useState } from 'react';

// Check if device is mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Check if device is iOS
export function useIsIOS() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/i.test(userAgent));
  }, []);

  return isIOS;
}

// Check if device is Android
export function useIsAndroid() {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/i.test(userAgent));
  }, []);

  return isAndroid;
}

// Prevent double tap zoom
export function usePreventDoubleTapZoom() {
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => document.removeEventListener('touchstart', handleTouchStart);
  }, [handleTouchStart]);
}

// Safe area insets for notched devices
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const styles = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(styles.getPropertyValue('--sat') || '0', 10),
        bottom: parseInt(styles.getPropertyValue('--sab') || '0', 10),
        left: parseInt(styles.getPropertyValue('--sal') || '0', 10),
        right: parseInt(styles.getPropertyValue('--sar') || '0', 10),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}

// Viewport height for mobile browsers
export function useViewportHeight() {
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const updateVh = () => {
      setVh(window.innerHeight * 0.01);
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    updateVh();
    window.addEventListener('resize', updateVh);
    return () => window.removeEventListener('resize', updateVh);
  }, []);

  return vh;
}

// Lock body scroll
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (locked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [locked]);
}

// Focus trap for modals
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
}
