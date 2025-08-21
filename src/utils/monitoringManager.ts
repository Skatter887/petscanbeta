// Utilità per il monitoring delle performance e del SEO
export interface MonitoringEvent {
  type: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  url: string;
  userAgent: string;
  sessionId: string;
  additionalData?: any;
}

export interface PerformanceEvent extends MonitoringEvent {
  category: 'performance';
  action: 'page-load' | 'api-call' | 'user-interaction' | 'error';
  loadTime?: number;
  ttfb?: number;
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
}

export interface SEOEvent extends MonitoringEvent {
  category: 'seo';
  action: 'page-view' | 'meta-update' | 'structured-data-update' | 'canonical-update';
  pageTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

export interface UserEvent extends MonitoringEvent {
  category: 'user';
  action: 'click' | 'scroll' | 'form-submit' | 'navigation';
  elementId?: string;
  elementType?: string;
  formData?: any;
}

class MonitoringManager {
  private events: MonitoringEvent[] = [];
  private sessionId: string;
  private maxEvents: number = 1000;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.init();
  }

  private init(): void {
    // Abilita/disabilita il monitoring in base all'ambiente
    this.isEnabled = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development';
    
    if (this.isEnabled) {
      this.setupPerformanceMonitoring();
      this.setupSEOMonitoring();
      this.setupUserMonitoring();
    }
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Setup del monitoring delle performance
  private setupPerformanceMonitoring(): void {
    // Monitora il caricamento della pagina
    window.addEventListener('load', () => {
      this.trackPerformanceEvent('page-load', {
        loadTime: performance.now(),
        ttfb: this.getTTFB(),
        fcp: this.getFCP(),
        lcp: this.getLCP(),
        fid: this.getFID(),
        cls: this.getCLS()
      });
    });

    // Monitora gli errori JavaScript
    window.addEventListener('error', (event) => {
      this.trackEvent('error', 'javascript', 'runtime-error', event.message, undefined, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Monitora le promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('error', 'promise', 'unhandled-rejection', event.reason);
    });
  }

  // Setup del monitoring SEO
  private setupSEOMonitoring(): void {
    // Monitora i cambiamenti delle meta tag
    this.observeMetaTagChanges();
    
    // Monitora i cambiamenti del title
    this.observeTitleChanges();
    
    // Monitora i cambiamenti del canonical
    this.observeCanonicalChanges();
  }

  // Setup del monitoring utente
  private setupUserMonitoring(): void {
    // Monitora i click
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target) {
        this.trackUserEvent('click', {
          elementId: target.id,
          elementType: target.tagName.toLowerCase(),
          elementText: target.textContent?.substring(0, 100)
        });
      }
    });

    // Monitora lo scroll
    let scrollTimeout: number;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        this.trackUserEvent('scroll', {
          scrollY: window.scrollY,
          scrollX: window.scrollX
        });
      }, 100);
    });

    // Monitora la navigazione
    window.addEventListener('popstate', () => {
      this.trackUserEvent('navigation', {
        url: window.location.href,
        referrer: document.referrer
      });
    });
  }

  // Osserva i cambiamenti delle meta tag
  private observeMetaTagChanges(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'META') {
                this.trackSEOEvent('meta-update', {
                  name: element.getAttribute('name'),
                  property: element.getAttribute('property'),
                  content: element.getAttribute('content')
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
  }

  // Osserva i cambiamenti del title
  private observeTitleChanges(): void {
    let currentTitle = document.title;
    
    const observer = new MutationObserver(() => {
      if (document.title !== currentTitle) {
        this.trackSEOEvent('title-update', {
          oldTitle: currentTitle,
          newTitle: document.title
        });
        currentTitle = document.title;
      }
    });

    observer.observe(document.querySelector('title') || document.head, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  // Osserva i cambiamenti del canonical
  private observeCanonicalChanges(): void {
    let currentCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    
    const observer = new MutationObserver(() => {
      const newCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      if (newCanonical !== currentCanonical) {
        this.trackSEOEvent('canonical-update', {
          oldCanonical: currentCanonical,
          newCanonical: newCanonical
        });
        currentCanonical = newCanonical;
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
  }

  // Traccia un evento generico
  trackEvent(
    type: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    additionalData?: any
  ): void {
    if (!this.isEnabled) return;

    const event: MonitoringEvent = {
      type,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      additionalData
    };

    this.events.push(event);
    
    // Mantieni solo gli ultimi eventi
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Invia l'evento al server
    this.sendEventToServer(event);
    
    // Log su console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Monitoring]', event);
    }
  }

  // Traccia un evento di performance
  trackPerformanceEvent(action: string, metrics: any): void {
    this.trackEvent('performance', 'performance', action, undefined, undefined, metrics);
  }

  // Traccia un evento SEO
  trackSEOEvent(action: string, data: any): void {
    this.trackEvent('seo', 'seo', action, undefined, undefined, data);
  }

  // Traccia un evento utente
  trackUserEvent(action: string, data: any): void {
    this.trackEvent('user', 'user', action, undefined, undefined, data);
  }

  // Ottieni metriche di performance
  private getTTFB(): number {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation && 'responseStart' in navigation && 'requestStart' in navigation) {
      return (navigation as any).responseStart - (navigation as any).requestStart;
    }
    return 0;
  }

  private getFCP(): number {
    const fcp = performance.getEntriesByType('first-contentful-paint')[0];
    return fcp ? fcp.startTime : 0;
  }

  private getLCP(): number {
    const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
    return lcp ? lcp.startTime : 0;
  }

  private getFID(): number {
    const fid = performance.getEntriesByType('first-input')[0];
    if (fid && 'processingStart' in fid && 'startTime' in fid) {
      return (fid as any).processingStart - fid.startTime;
    }
    return 0;
  }

  private getCLS(): number {
    // CLS viene calcolato dinamicamente dal PerformanceObserver
    return 0;
  }

  // Invia evento al server
  private sendEventToServer(event: MonitoringEvent): void {
    if (navigator.sendBeacon) {
      const data = JSON.stringify(event);
      navigator.sendBeacon('/api/monitoring', data);
    }
  }

  // Ottieni tutti gli eventi
  getEvents(): MonitoringEvent[] {
    return [...this.events];
  }

  // Ottieni eventi per categoria
  getEventsByCategory(category: string): MonitoringEvent[] {
    return this.events.filter(event => event.category === category);
  }

  // Ottieni eventi per tipo
  getEventsByType(type: string): MonitoringEvent[] {
    return this.events.filter(event => event.type === type);
  }

  // Ottieni statistiche degli eventi
  getEventStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
    this.events.forEach(event => {
      const key = `${event.category}:${event.action}`;
      stats[key] = (stats[key] || 0) + 1;
    });
    
    return stats;
  }

  // Pulisci gli eventi
  clearEvents(): void {
    this.events = [];
  }

  // Abilita/disabilita il monitoring
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Ottieni lo stato del monitoring
  isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }

  // Ottieni l'ID della sessione
  getSessionId(): string {
    return this.sessionId;
  }
}

// Istanza globale del monitoring manager
export const monitoringManager = new MonitoringManager();

// Funzioni di utilità per il monitoring
export function trackEvent(
  type: string,
  category: string,
  action: string,
  label?: string,
  value?: number,
  additionalData?: any
): void {
  monitoringManager.trackEvent(type, category, action, label, value, additionalData);
}

export function trackPerformanceEvent(action: string, metrics: any): void {
  monitoringManager.trackPerformanceEvent(action, metrics);
}

export function trackSEOEvent(action: string, data: any): void {
  monitoringManager.trackSEOEvent(action, data);
}

export function trackUserEvent(action: string, data: any): void {
  monitoringManager.trackUserEvent(action, data);
}

export function getMonitoringEvents(): MonitoringEvent[] {
  return monitoringManager.getEvents();
}

export function getMonitoringStats(): Record<string, number> {
  return monitoringManager.getEventStats();
}

// Hook per React
export function useMonitoring() {
  const [events, setEvents] = React.useState<MonitoringEvent[]>([]);
  const [stats, setStats] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const updateData = () => {
      setEvents(monitoringManager.getEvents());
      setStats(monitoringManager.getEventStats());
    };

    // Aggiorna i dati ogni secondo
    const interval = setInterval(updateData, 1000);

    // Aggiorna i dati inizialmente
    updateData();

    return () => clearInterval(interval);
  }, []);

  return {
    events,
    stats,
    trackEvent: monitoringManager.trackEvent.bind(monitoringManager),
    trackPerformanceEvent: monitoringManager.trackPerformanceEvent.bind(monitoringManager),
    trackSEOEvent: monitoringManager.trackSEOEvent.bind(monitoringManager),
    trackUserEvent: monitoringManager.trackUserEvent.bind(monitoringManager)
  };
}
