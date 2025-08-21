// Gestione errori e logging per SEO e performance
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.init();
  }

  init() {
    // Gestione errori JavaScript
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    });

    // Gestione errori di rete
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    });

    // Gestione errori di caricamento risorse
    window.addEventListener('error', (event) => {
      if (event.target && event.target.tagName) {
        this.logError('Resource Loading Error', {
          tagName: event.target.tagName,
          src: event.target.src || event.target.href,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
      }
    }, true);

    // Monitoraggio performance
    this.monitorPerformance();
  }

  logError(type, details) {
    const error = {
      type,
      details,
      timestamp: new Date().toISOString()
    };

    this.errors.push(error);
    
    // Mantieni solo gli ultimi errori
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log su console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${type}]`, details);
    }

    // Invia errori critici al server (se configurato)
    this.sendErrorToServer(error);
  }

  monitorPerformance() {
    // Monitora Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.logPerformance('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.logPerformance('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.logPerformance('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Monitora tempo di caricamento della pagina
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.logPerformance('Page Load Time', loadTime);
    });
  }

  logPerformance(metric, value) {
    const performance = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Log performance su console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric}:`, value);
    }

    // Invia metriche al server per analytics
    this.sendPerformanceToServer(performance);
  }

  sendErrorToServer(error) {
    // Implementa l'invio degli errori al server per monitoring
    // Questo può essere utile per identificare problemi di SEO
    if (navigator.sendBeacon) {
      const data = JSON.stringify(error);
      navigator.sendBeacon('/api/errors', data);
    }
  }

  sendPerformanceToServer(performance) {
    // Implementa l'invio delle metriche performance al server
    if (navigator.sendBeacon) {
      const data = JSON.stringify(performance);
      navigator.sendBeacon('/api/performance', data);
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

// Inizializza l'error handler
const errorHandler = new ErrorHandler();

// Esporta per uso esterno
export default errorHandler;

// Monitora errori di React
if (window.React && window.React.Component) {
  const originalComponentDidCatch = window.React.Component.prototype.componentDidCatch;
  window.React.Component.prototype.componentDidCatch = function(error, errorInfo) {
    errorHandler.logError('React Error Boundary', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    if (originalComponentDidCatch) {
      originalComponentDidCatch.call(this, error, errorInfo);
    }
  };
}
