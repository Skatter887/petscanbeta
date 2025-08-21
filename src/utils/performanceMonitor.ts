// Utilità per il monitoring delle performance e Core Web Vitals
export interface PerformanceMetrics {
  lcp: number;        // Largest Contentful Paint
  fid: number;        // First Input Delay
  cls: number;        // Cumulative Layout Shift
  fcp: number;        // First Contentful Paint
  ttfb: number;       // Time to First Byte
  loadTime: number;   // Tempo totale di caricamento
}

export interface PerformanceThresholds {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
}

export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: 2500,  // 2.5 secondi
  fid: 100,   // 100 millisecondi
  cls: 0.1,   // 0.1
  fcp: 1800,  // 1.8 secondi
  ttfb: 800   // 800 millisecondi
};

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    loadTime: 0
  };

  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isInitialized) return;
    
    this.setupObservers();
    this.measureLoadTime();
    this.isInitialized = true;
  }

  private setupObservers(): void {
    // Observer per LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.logMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer setup failed:', error);
      }

      // Observer per FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if ('processingStart' in entry) {
              const fid = (entry as any).processingStart - entry.startTime;
              this.metrics.fid = fid;
              this.logMetric('FID', fid);
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer setup failed:', error);
      }

      // Observer per CLS (Cumulative Layout Shift)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach(entry => {
            if ('value' in entry) {
              clsValue += (entry as any).value;
            }
          });
          this.metrics.cls = clsValue;
          this.logMetric('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS observer setup failed:', error);
      }

      // Observer per FCP (First Contentful Paint)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          this.metrics.fcp = firstEntry.startTime;
          this.logMetric('FCP', firstEntry.startTime);
        });
        fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
        this.observers.push(fcpObserver);
      } catch (error) {
        console.warn('FCP observer setup failed:', error);
      }
    }
  }

  private measureLoadTime(): void {
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now();
      this.logMetric('Load Time', this.metrics.loadTime);
      
      // Misura TTFB se disponibile
      if ('PerformanceNavigationTiming' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation && 'responseStart' in navigation && 'requestStart' in navigation) {
          const ttfb = (navigation as any).responseStart - (navigation as any).requestStart;
          this.metrics.ttfb = ttfb;
          this.logMetric('TTFB', ttfb);
        }
      }
    });
  }

  private logMetric(name: string, value: number): void {
    const status = this.getMetricStatus(name as keyof PerformanceThresholds, value);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value}ms (${status})`);
    }

    // Invia metrica al server
    this.sendMetricToServer(name, value, status);
  }

  private getMetricStatus(name: keyof PerformanceThresholds, value: number): string {
    const threshold = PERFORMANCE_THRESHOLDS[name];
    if (value <= threshold) return 'good';
    if (value <= threshold * 1.5) return 'needs improvement';
    return 'poor';
  }

  private sendMetricToServer(name: string, value: number, status: string): void {
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        type: 'performance',
        metric: name,
        value,
        status,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      navigator.sendBeacon('/api/performance', data);
    }
  }

  // Metodi pubblici
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getMetric(name: keyof PerformanceMetrics): number {
    return this.metrics[name];
  }

  isMetricGood(name: keyof PerformanceThresholds): boolean {
    const value = this.metrics[name];
    const threshold = PERFORMANCE_THRESHOLDS[name];
    return value > 0 && value <= threshold;
  }

  isMetricNeedsImprovement(name: keyof PerformanceThresholds): boolean {
    const value = this.metrics[name];
    const threshold = PERFORMANCE_THRESHOLDS[name];
    return value > threshold && value <= threshold * 1.5;
  }

  isMetricPoor(name: keyof PerformanceThresholds): boolean {
    const value = this.metrics[name];
    const threshold = PERFORMANCE_THRESHOLDS[name];
    return value > threshold * 1.5;
  }

  getPerformanceReport(): Record<string, { value: number; status: string; threshold: any }> {
    const report: Record<string, { value: number; status: string; threshold: any }> = {};
    
    Object.keys(PERFORMANCE_THRESHOLDS).forEach(metric => {
      const key = metric as keyof PerformanceThresholds;
      const value = this.metrics[key];
      const threshold = PERFORMANCE_THRESHOLDS[key];
      
      if (value > 0) {
        let status = 'good';
        if (value > threshold * 1.5) status = 'poor';
        else if (value > threshold) status = 'needs improvement';
        
        report[metric] = { value, status, threshold };
      }
    });
    
    return report;
  }

  destroy(): void {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect observer:', error);
      }
    });
    this.observers = [];
    this.isInitialized = false;
  }
}

// Istanza globale del performance monitor
export const performanceMonitor = new PerformanceMonitor();

// Funzioni di utilità per il monitoring delle performance
export function getPerformanceMetrics(): PerformanceMetrics {
  return performanceMonitor.getMetrics();
}

export function getPerformanceReport(): Record<string, { value: number; status: string; threshold: any }> {
  return performanceMonitor.getPerformanceReport();
}

export function isPerformanceGood(): boolean {
  const report = getPerformanceReport();
  return Object.values(report).every(metric => metric.status === 'good');
}

export function getPerformanceScore(): number {
  const report = getPerformanceReport();
  const totalMetrics = Object.keys(report).length;
  if (totalMetrics === 0) return 0;
  
  const goodMetrics = Object.values(report).filter(metric => metric.status === 'good').length;
  return Math.round((goodMetrics / totalMetrics) * 100);
}

// Hook per React
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    loadTime: 0
  });

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    // Aggiorna le metriche ogni secondo
    const interval = setInterval(updateMetrics, 1000);

    // Aggiorna le metriche inizialmente
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    report: performanceMonitor.getPerformanceReport(),
    isGood: isPerformanceGood(),
    score: getPerformanceScore()
  };
}
