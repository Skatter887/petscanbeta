// Configurazione per ottimizzazioni performance e SEO
const performanceConfig = {
  // Preload delle risorse critiche
  preloadResources: [
    '/src/main.tsx',
    '/src/index.css',
    '/petscan-logo.png'
  ],
  
  // Lazy loading per componenti non critici
  lazyLoadComponents: [
    'ProductAnalysisCard',
    'FAQ',
    'HowItWorks'
  ],
  
  // Cache strategy per service worker
  cacheStrategy: {
    static: {
      maxAge: 31536000, // 1 anno
      immutable: true
    },
    dynamic: {
      maxAge: 86400, // 1 giorno
      immutable: false
    }
  },
  
  // Ottimizzazioni per Core Web Vitals
  coreWebVitals: {
    lcp: {
      target: 2.5, // seconds
      threshold: 4.0
    },
    fid: {
      target: 100, // milliseconds
      threshold: 300
    },
    cls: {
      target: 0.1,
      threshold: 0.25
    }
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
document.addEventListener('DOMContentLoaded', () => {
  performanceConfig.preloadResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
});

// Intersection Observer per lazy loading
const lazyLoadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      if (target.dataset.src) {
        target.src = target.dataset.src;
        target.removeAttribute('data-src');
        lazyLoadObserver.unobserve(target);
      }
    }
  });
});

// Applica lazy loading alle immagini
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => lazyLoadObserver.observe(img));
});

export default performanceConfig;
