import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  event_name: string;
  user_id?: string;
  session_id: string;
  page_url: string;
  user_agent: string;
  referrer?: string;
  properties?: Record<string, any>;
  timestamp: string;
}

export interface PageView {
  page_url: string;
  page_title: string;
  user_id?: string;
  session_id: string;
  duration?: number;
  timestamp: string;
}

class AnalyticsService {
  private sessionId: string;
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    // Écouter les changements de page
    this.setupPageTracking();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupPageTracking() {
    // Tracker la page initiale
    this.trackPageView(window.location.pathname, document.title);

    // Écouter les changements d'URL (pour les SPAs)
    let currentUrl = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentUrl) {
        currentUrl = window.location.pathname;
        this.trackPageView(currentUrl, document.title);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Tracker une page vue
  async trackPageView(pageUrl: string, pageTitle: string, userId?: string) {
    try {
      const pageView: PageView = {
        page_url: pageUrl,
        page_title: pageTitle,
        user_id: userId,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
      };

      // En production, vous pourriez utiliser une table analytics
      console.log('Page view tracked:', pageView);
      
      // Optionnel : envoyer à Supabase ou un service d'analytics
      // await supabase.from('page_views').insert([pageView]);
      
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Tracker un événement personnalisé
  async trackEvent(
    eventName: string,
    properties?: Record<string, any>,
    userId?: string
  ) {
    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        user_id: userId,
        session_id: this.sessionId,
        page_url: window.location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        properties,
        timestamp: new Date().toISOString(),
      };

      console.log('Event tracked:', event);
      
      // Optionnel : envoyer à Supabase ou un service d'analytics
      // await supabase.from('analytics_events').insert([event]);
      
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Tracker les actions e-commerce
  async trackPurchase(orderId: string, value: number, currency: string, items: any[]) {
    await this.trackEvent('purchase', {
      order_id: orderId,
      value,
      currency,
      items,
    });
  }

  async trackAddToCart(productId: string, productName: string, price: number) {
    await this.trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      price,
    });
  }

  async trackProductView(productId: string, productName: string, category: string) {
    await this.trackEvent('view_item', {
      product_id: productId,
      product_name: productName,
      category,
    });
  }

  async trackSearch(searchTerm: string, resultsCount: number) {
    await this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  }

  async trackSignup(method: string) {
    await this.trackEvent('sign_up', {
      method,
    });
  }

  async trackLogin(method: string) {
    await this.trackEvent('login', {
      method,
    });
  }

  // Tracker la performance
  async trackPerformance() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      await this.trackEvent('page_performance', {
        load_time: navigation.loadEventEnd - navigation.loadEventStart,
        dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        first_paint: performance.getEntriesByName('first-paint')[0]?.startTime,
        largest_contentful_paint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
      });
    }
  }

  // Tracker les erreurs JavaScript
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_lineno: event.lineno,
        error_colno: event.colno,
        stack: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
      });
    });
  }
}

// Instance globale du service d'analytics
export const analytics = new AnalyticsService();

// Hook React pour utiliser les analytics
export const useAnalytics = () => {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackPurchase: analytics.trackPurchase.bind(analytics),
    trackAddToCart: analytics.trackAddToCart.bind(analytics),
    trackProductView: analytics.trackProductView.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackSignup: analytics.trackSignup.bind(analytics),
    trackLogin: analytics.trackLogin.bind(analytics),
  };
};
