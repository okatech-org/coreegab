import { useState, useEffect } from 'react';

export interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  browserName: string;
  osName: string;
  canInstallPWA: boolean;
  isStandalone: boolean;
  supportsWebShare: boolean;
  supportsPushNotifications: boolean;
}

export const usePlatformDetection = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    browserName: 'unknown',
    osName: 'unknown',
    canInstallPWA: false,
    isStandalone: false,
    supportsWebShare: false,
    supportsPushNotifications: false,
  });

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Détection du système d'exploitation
      const isIOS = /ipad|iphone|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isTablet = /ipad/.test(userAgent) || (/android/.test(userAgent) && !/mobile/.test(userAgent));
      
      // Détection du navigateur
      let browserName = 'unknown';
      if (userAgent.includes('chrome')) browserName = 'chrome';
      else if (userAgent.includes('firefox')) browserName = 'firefox';
      else if (userAgent.includes('safari')) browserName = 'safari';
      else if (userAgent.includes('edge')) browserName = 'edge';
      else if (userAgent.includes('opera')) browserName = 'opera';
      
      // Détection de l'OS
      let osName = 'unknown';
      if (isIOS) osName = 'ios';
      else if (isAndroid) osName = 'android';
      else if (userAgent.includes('windows')) osName = 'windows';
      else if (userAgent.includes('mac')) osName = 'macos';
      else if (userAgent.includes('linux')) osName = 'linux';
      
      // Capacités PWA
      const canInstallPWA = 'serviceWorker' in navigator && 
                           ('BeforeInstallPromptEvent' in window || isIOS);
      
      const supportsWebShare = 'share' in navigator;
      const supportsPushNotifications = 'serviceWorker' in navigator && 
                                       'PushManager' in window && 
                                       'Notification' in window;
      
      setPlatformInfo({
        isIOS,
        isAndroid,
        isMobile: isMobileDevice && !isTablet,
        isTablet,
        isDesktop: !isMobileDevice,
        browserName,
        osName,
        canInstallPWA,
        isStandalone: standalone,
        supportsWebShare,
        supportsPushNotifications,
      });
    };

    detectPlatform();
    
    // Écouter les changements de display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => detectPlatform();
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return platformInfo;
};