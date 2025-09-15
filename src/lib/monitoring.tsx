import * as Sentry from '@sentry/react';

// Configuration Sentry
export const initMonitoring = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

// Service de monitoring personnalisé
export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Map<string, number> = new Map();
  private events: Array<{ name: string; timestamp: number; data?: any }> = [];

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Tracking des erreurs
  trackError(error: Error, context?: Record<string, any>) {
    console.error('Error tracked:', error, context);
    
    if (import.meta.env.PROD) {
      Sentry.captureException(error, {
        tags: context,
      });
    }
  }

  // Tracking des événements métier
  trackEvent(eventName: string, properties?: Record<string, any>) {
    const event = {
      name: eventName,
      timestamp: Date.now(),
      data: properties,
    };
    
    this.events.push(event);
    
    // Garder seulement les 100 derniers événements
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }

    console.log('Event tracked:', event);
  }

  // Tracking des performances
  trackPerformance(metricName: string, value: number) {
    this.metrics.set(metricName, value);
    
    if (import.meta.env.PROD) {
      Sentry.addBreadcrumb({
        message: `Performance: ${metricName}`,
        data: { value },
        level: 'info',
      });
    }
  }

  // Tracking des conversions
  trackConversion(type: string, value?: number) {
    this.trackEvent('conversion', { type, value });
    
    if (import.meta.env.PROD) {
      Sentry.addBreadcrumb({
        message: `Conversion: ${type}`,
        data: { value },
        level: 'info',
      });
    }
  }

  // Obtenir les métriques
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Obtenir les événements récents
  getRecentEvents(limit = 10) {
    return this.events.slice(-limit);
  }

  // Nettoyer les données
  clearData() {
    this.metrics.clear();
    this.events = [];
  }
}

// Hook React pour le monitoring
export const useMonitoring = () => {
  const monitoring = MonitoringService.getInstance();

  return {
    trackError: monitoring.trackError.bind(monitoring),
    trackEvent: monitoring.trackEvent.bind(monitoring),
    trackPerformance: monitoring.trackPerformance.bind(monitoring),
    trackConversion: monitoring.trackConversion.bind(monitoring),
    getMetrics: monitoring.getMetrics.bind(monitoring),
    getRecentEvents: monitoring.getRecentEvents.bind(monitoring),
  };
};

// Composant de monitoring des performances
export const PerformanceMonitor = ({ children }: { children: React.ReactNode }) => {
  const { trackPerformance } = useMonitoring();

  React.useEffect(() => {
    // Mesurer le temps de chargement initial
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      trackPerformance('page_load_time', loadTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [trackPerformance]);

  return <>{children}</>;
};
