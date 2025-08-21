// Configurazione per ottimizzazioni performance e SEO
const performanceConfig = {
  // Preload delle risorse critiche
  preloadResources: [
    '/src/main.tsx',
    '/src/index.css',
    '/petscan-logo.png'
  ],

  // Lazy loading dei componenti
  lazyLoadComponents: [
    'ProductAnalysisCard',
    'ProductEvaluationCard',
    'FAQ',
    'HowItWorks'
  ],

  // Strategie di caching
  cacheStrategy: {
    // Cache-First per risorse statiche
    static: {
      strategy: 'cache-first',
      maxAge: 31536000, // 1 anno
      immutable: true
    },
    // Network-First per API
    api: {
      strategy: 'network-first',
      maxAge: 300, // 5 minuti
      fallback: true
    },
    // Stale-While-Revalidate per contenuti dinamici
    dynamic: {
      strategy: 'stale-while-revalidate',
      maxAge: 3600, // 1 ora
      revalidate: true
    }
  },

  // Core Web Vitals targets
  coreWebVitals: {
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100,  // First Input Delay (ms)
    cls: 0.1,  // Cumulative Layout Shift
    fcp: 1800, // First Contentful Paint (ms)
    ttfb: 800  // Time to First Byte (ms)
  },

  // Configurazione Service Worker
  serviceWorker: {
    enabled: true,
    scope: '/',
    updateViaCache: 'none',
    skipWaiting: true,
    clientsClaim: true
  },

  // Configurazione preload
  preload: {
    critical: [
      '/src/main.tsx',
      '/src/index.css',
      '/petscan-logo.png'
    ],
    fonts: [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ],
    images: [
      '/petscan-logo.png',
      '/logo_no_cont.png'
    ]
  },

  // Configurazione lazy loading
  lazyLoading: {
    images: true,
    components: true,
    routes: true,
    threshold: 0.1,
    rootMargin: '50px'
  },

  // Configurazione compressione
  compression: {
    gzip: true,
    brotli: true,
    minify: {
      html: true,
      css: true,
      js: true
    }
  },

  // Configurazione CDN
  cdn: {
    enabled: false,
    domains: [
      'cdn.mypetscan.it',
      'static.mypetscan.it'
    ]
  },

  // Configurazione monitoring
  monitoring: {
    enabled: true,
    performance: true,
    errors: true,
    user: true,
    seo: true,
    analytics: true
  }
};

// Service Worker per caching e performance
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Preload delle risorse critiche
export function preloadCriticalResources(): void {
  performanceConfig.preload.critical.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.js') ? 'script' : 
              resource.endsWith('.css') ? 'style' : 
              resource.endsWith('.png') || resource.endsWith('.jpg') ? 'image' : 'fetch';
    document.head.appendChild(link);
  });
}

// Lazy loading per immagini
export function setupLazyLoading(): void {
  if (!performanceConfig.lazyLoading.images) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      }
    });
  }, {
    threshold: performanceConfig.lazyLoading.threshold,
    rootMargin: performanceConfig.lazyLoading.rootMargin
  });

  // Osserva tutte le immagini con data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Preload dei font
export function preloadFonts(): void {
  performanceConfig.preload.fonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontUrl;
    link.as = 'style';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Inizializzazione delle ottimizzazioni
export function initializePerformanceOptimizations(): void {
  // Preload risorse critiche
  preloadCriticalResources();
  
  // Preload font
  preloadFonts();
  
  // Setup lazy loading
  setupLazyLoading();
  
  // Log delle ottimizzazioni
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance optimizations initialized:', performanceConfig);
  }
}

// Ottieni la configurazione
export function getPerformanceConfig() {
  return performanceConfig;
}

// Aggiorna la configurazione
export function updatePerformanceConfig(newConfig: Partial<typeof performanceConfig>): void {
  Object.assign(performanceConfig, newConfig);
}

export default performanceConfig;
