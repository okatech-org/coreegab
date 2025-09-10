import { useState, useEffect } from 'react';

export interface MobileOptimizations {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  touchSupport: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  viewportHeight: number;
  viewportWidth: number;
  safeAreaTop: number;
  safeAreaBottom: number;
}

export const useMobileOptimizations = (): MobileOptimizations => {
  const [optimizations, setOptimizations] = useState<MobileOptimizations>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'portrait',
    screenSize: 'lg',
    touchSupport: false,
    isIOS: false,
    isAndroid: false,
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
    safeAreaTop: 0,
    safeAreaBottom: 0,
  });

  useEffect(() => {
    const updateOptimizations = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Détection des tailles d'écran
      let screenSize: MobileOptimizations['screenSize'] = 'xs';
      if (width >= 1536) screenSize = '2xl';
      else if (width >= 1280) screenSize = 'xl';
      else if (width >= 1024) screenSize = 'lg';
      else if (width >= 768) screenSize = 'md';
      else if (width >= 640) screenSize = 'sm';

      // Détection des appareils
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      // Détection des plateformes
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      
      // Détection du support tactile
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Orientation
      const orientation = height > width ? 'portrait' : 'landscape';
      
      // Safe area pour les appareils avec encoche
      const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0');
      const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0');

      setOptimizations({
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        screenSize,
        touchSupport,
        isIOS,
        isAndroid,
        viewportHeight: height,
        viewportWidth: width,
        safeAreaTop,
        safeAreaBottom,
      });
    };

    // Mise à jour initiale
    updateOptimizations();

    // Écouter les changements
    const handleResize = () => updateOptimizations();
    const handleOrientationChange = () => setTimeout(updateOptimizations, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // CSS pour les safe areas iOS
    if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
      document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');
      document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return optimizations;
};

// Hook pour les gestes tactiles
export const useTouchGestures = () => {
  const [gesture, setGesture] = useState<{
    type: 'swipe' | 'pinch' | 'tap' | null;
    direction?: 'left' | 'right' | 'up' | 'down';
    distance?: number;
  }>({ type: null });

  useEffect(() => {
    let startTouch: Touch | null = null;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startTouch = e.touches[0];
      startTime = Date.now();
      setGesture({ type: null });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startTouch) return;

      const endTouch = e.changedTouches[0];
      const deltaX = endTouch.clientX - startTouch.clientX;
      const deltaY = endTouch.clientY - startTouch.clientY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const duration = Date.now() - startTime;

      // Détecter le type de geste
      if (duration < 300 && distance < 10) {
        setGesture({ type: 'tap' });
      } else if (distance > 50) {
        let direction: 'left' | 'right' | 'up' | 'down';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        setGesture({ type: 'swipe', direction, distance });
      }

      startTouch = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return gesture;
};

// Hook pour la détection de la connectivité
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Détecter le type de connexion (si disponible)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};
