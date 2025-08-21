// Gestione errori e logging per SEO e performance
class ErrorHandler {
  private errors: Array<{
    type: string;
    message: string;
    stack?: string;
    timestamp: number;
    url: string;
    userAgent: string;
  }> = [];

  private maxErrors: number = 100;

  constructor() {
    this.init();
  }

  init(): void {
    // Gestione errori JavaScript
    window.addEventListener('error', (event) => {
      this.logError('javascript', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Gestione promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('promise', {
        message: event.reason,
        promise: event.promise
      });
    });

    // Gestione errori di caricamento risorse
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        this.logError('resource', {
          message: `Failed to load resource: ${target.tagName}`,
          src: target.getAttribute('src') || target.getAttribute('href'),
          tagName: target.tagName
        });
      }
    }, true);

    // Monitoraggio performance
    this.monitorPerformance();
  }

  logError(type: string, details: any): void {
    const error = {
      type,
      message: details.message || 'Unknown error',
      stack: details.error?.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(error);

    // Mantieni solo gli ultimi errori
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log su console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ErrorHandler] ${type}:`, error);
    }

    // Invia errore al server
    this.sendErrorToServer(error);
  }

  monitorPerformance(): void {
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
          if ('processingStart' in entry) {
            const fid = (entry as any).processingStart - entry.startTime;
            this.logPerformance('FID', fid);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if ('value' in entry) {
            clsValue += (entry as any).value;
          }
        });
        this.logPerformance('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        this.logPerformance('FCP', firstEntry.startTime);
      });
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
    }

    // Monitora tempo di caricamento pagina
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.logPerformance('Load Time', loadTime);
    });

    // Monitora Time to First Byte (TTFB)
    if ('PerformanceNavigationTiming' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation && 'responseStart' in navigation && 'requestStart' in navigation) {
        const ttfb = (navigation as any).responseStart - (navigation as any).requestStart;
        this.logPerformance('TTFB', ttfb);
      }
    }
  }

  logPerformance(metric: string, value: number): void {
    const performance = {
      metric,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log su console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric}:`, value);
    }

    // Invia metriche al server
    this.sendPerformanceToServer(performance);
  }

  sendErrorToServer(error: any): void {
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        type: 'error',
        data: error
      });
      navigator.sendBeacon('/api/errors', data);
    }
  }

  sendPerformanceToServer(performance: any): void {
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        type: 'performance',
        data: performance
      });
      navigator.sendBeacon('/api/performance', data);
    }
  }

  getErrors(): Array<any> {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
    this.errors.forEach(error => {
      stats[error.type] = (stats[error.type] || 0) + 1;
    });
    
    return stats;
  }
}

// Istanza globale dell'error handler
export const errorHandler = new ErrorHandler();

// Funzioni di utilità per la gestione degli errori
export function logError(type: string, details: any): void {
  errorHandler.logError(type, details);
}

export function logPerformance(metric: string, value: number): void {
  errorHandler.logPerformance(metric, value);
}

export function getErrors(): Array<any> {
  return errorHandler.getErrors();
}

export function getErrorStats(): Record<string, number> {
  return errorHandler.getErrorStats();
}

// React Error Boundary
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError('react', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Qualcosa è andato storto</h2>
          <p>Si è verificato un errore. Riprova a ricaricare la pagina.</p>
          <button onClick={() => window.location.reload()}>
            Ricarica Pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default errorHandler;
