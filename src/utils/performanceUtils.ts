// Utilità per il monitoring delle performance e Core Web Vitals
export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  loadTime: number;
}

export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  cls: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
}

// Soglie di performance per Core Web Vitals
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  ttfb: { good: 800, needsImprovement: 1800 },
  fcp: { good: 1800, needsImprovement: 3000 }
};

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    fcp: 0,
    loadTime: 0
  };

  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isInitialized || !('PerformanceObserver' in window)) {
      return;
    }

    this.setupObservers();
    this.measureLoadTime();
    this.isInitialized = true;
  }

  private setupObservers(): void {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.logMetric('LCP', this.metrics.lcp);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer setup failed:', error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if ('processingStart' in entry && 'startTime' in entry) {
              this.metrics.fid = (entry as any).processingStart - entry.startTime;
              this.logMetric('FID', this.metrics.fid);
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer setup failed:', error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if ('hadRecentInput' in entry && 'value' in entry) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });
          this.metrics.cls = clsValue;
          this.logMetric('CLS', this.metrics.cls);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS observer setup failed:', error);
      }

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          this.metrics.fcp = firstEntry.startTime;
          this.logMetric('FCP', this.metrics.fcp);
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
      
      // Misura Time to First Byte (TTFB)
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry && 'responseStart' in navigationEntry && 'requestStart' in navigationEntry) {
        this.metrics.ttfb = (navigationEntry as any).responseStart - (navigationEntry as any).requestStart;
        this.logMetric('TTFB', this.metrics.ttfb);
      }
    });
  }

  private logMetric(name: string, value: number): void {
    const threshold = PERFORMANCE_THRESHOLDS[name.toLowerCase() as keyof PerformanceThresholds];
    let status = 'unknown';
    
    if (threshold) {
      if (value <= threshold.good) {
        status = 'good';
      } else if (value <= threshold.needsImprovement) {
        status = 'needs-improvement';
      } else {
        status = 'poor';
      }
    }

    console.log(`[Performance] ${name}: ${value.toFixed(2)}ms (${status})`);
    
    // Invia metriche al server per analytics
    this.sendMetricToServer(name, value, status);
  }

  private sendMetricToServer(name: string, value: number, status: string): void {
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        metric: name,
        value,
        status,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      navigator.sendBeacon('/api/performance', data);
    }
  }

  // Ottieni tutte le metriche
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Ottieni una metrica specifica
  getMetric(name: keyof PerformanceMetrics): number {
    return this.metrics[name];
  }

  // Verifica se una metrica è nella soglia "good"
  isMetricGood(name: keyof PerformanceThresholds): boolean {
    const metric = this.metrics[name];
    const threshold = PERFORMANCE_THRESHOLDS[name];
    
    if (!threshold) return false;
    return metric <= threshold.good;
  }

  // Verifica se una metrica è nella soglia "needs improvement"
  isMetricNeedsImprovement(name: keyof PerformanceThresholds): boolean {
    const metric = this.metrics[name];
    const threshold = PERFORMANCE_THRESHOLDS[name];
    
    if (!threshold) return false;
    return metric > threshold.good && metric <= threshold.needsImprovement;
  }

  // Verifica se una metrica è nella soglia "poor"
  isMetricPoor(name: keyof PerformanceThresholds): boolean {
    const metric = this.metrics[name];
    const threshold = PERFORMANCE_THRESHOLDS[name];
    
    if (!threshold) return false;
    return metric > threshold.needsImprovement;
  }

  // Ottieni il report completo delle performance
  getPerformanceReport(): Record<string, { value: number; status: string; threshold: any }> {
    const report: Record<string, { value: number; status: string; threshold: any }> = {};
    
    Object.keys(this.metrics).forEach(metricName => {
      const name = metricName as keyof PerformanceMetrics;
      const value = this.metrics[name];
      const threshold = PERFORMANCE_THRESHOLDS[name];
      
      let status = 'unknown';
      if (threshold) {
        if (value <= threshold.good) {
          status = 'good';
        } else if (value <= threshold.needsImprovement) {
          status = 'needs-improvement';
        } else {
          status = 'poor';
        }
      }
      
      report[name] = {
        value,
        status,
        threshold
      };
    });
    
    return report;
  }

  // Pulisci gli observer
  destroy(): void {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting observer:', error);
      }
    });
    this.observers = [];
    this.isInitialized = false;
  }
}

// Istanza globale del monitor
export const performanceMonitor = new PerformanceMonitor();

// Funzione per ottenere il report delle performance
export function getPerformanceReport() {
  return performanceMonitor.getPerformanceReport();
}

// Funzione per verificare se le performance sono buone
export function arePerformanceGood(): boolean {
  const report = performanceMonitor.getPerformanceReport();
  return Object.values(report).every(metric => metric.status === 'good');
}

// Funzione per ottenere le metriche in tempo reale
export function getRealTimeMetrics(): PerformanceMetrics {
  return performanceMonitor.getMetrics();
}
