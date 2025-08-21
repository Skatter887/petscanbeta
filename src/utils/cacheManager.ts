// Utilità per la gestione del caching e delle performance
export interface CacheConfig {
  maxAge: number;      // Tempo di vita massimo in millisecondi
  maxSize: number;     // Numero massimo di elementi
  strategy: 'lru' | 'fifo' | 'lfu';
}

export interface CacheItem<T = any> {
  key: string;
  value: T;
  timestamp: number;
  size: number;
  accessCount: number;
  lastAccess: number;
}

class CacheManager {
  private caches: Map<string, CacheItem[]> = new Map();
  private configs: Map<string, CacheConfig> = new Map();

  constructor() {
    this.initDefaultConfigs();
  }

  private initDefaultConfigs(): void {
    // Cache per API calls
    this.addCacheConfig('api', {
      maxAge: 5 * 60 * 1000, // 5 minuti
      maxSize: 100,
      strategy: 'lru'
    });

    // Cache per immagini
    this.addCacheConfig('images', {
      maxAge: 24 * 60 * 60 * 1000, // 24 ore
      maxSize: 50,
      strategy: 'lru'
    });

    // Cache per dati statici
    this.addCacheConfig('static', {
      maxAge: 60 * 60 * 1000, // 1 ora
      maxSize: 200,
      strategy: 'fifo'
    });

    // Cache per risultati di ricerca
    this.addCacheConfig('search', {
      maxAge: 15 * 60 * 1000, // 15 minuti
      maxSize: 50,
      strategy: 'lru'
    });
  }

  set<T>(cacheName: string, key: string, value: T, size: number = 1): void {
    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, []);
    }

    const cache = this.caches.get(cacheName)!;
    const config = this.configs.get(cacheName);
    
    if (!config) {
      console.warn(`Cache config not found for: ${cacheName}`);
      return;
    }

    // Rimuovi elemento esistente se presente
    this.remove(cacheName, key);

    // Crea nuovo elemento
    const item: CacheItem<T> = {
      key,
      value,
      timestamp: Date.now(),
      size,
      accessCount: 0,
      lastAccess: Date.now()
    };

    // Aggiungi elemento
    cache.push(item);

    // Applica strategia di caching
    this.applyCacheStrategy(cacheName, config);

    // Cleanup se necessario
    if (cache.length > config.maxSize) {
      this.cleanupCache(cacheName);
    }
  }

  get<T>(cacheName: string, key: string): T | null {
    const cache = this.caches.get(cacheName);
    if (!cache) return null;

    const item = cache.find(item => item.key === key);
    if (!item) return null;

    // Verifica se l'elemento è scaduto
    const config = this.configs.get(cacheName);
    if (config && Date.now() - item.timestamp > config.maxAge) {
      this.remove(cacheName, key);
      return null;
    }

    // Aggiorna statistiche di accesso
    item.accessCount++;
    item.lastAccess = Date.now();

    // Riorganizza cache se necessario
    if (config && config.strategy === 'lru') {
      this.reorderLRU(cacheName, item);
    }

    return item.value;
  }

  remove(cacheName: string, key: string): boolean {
    const cache = this.caches.get(cacheName);
    if (!cache) return false;

    const index = cache.findIndex(item => item.key === key);
    if (index === -1) return false;

    cache.splice(index, 1);
    return true;
  }

  cleanupCache(cacheName: string): void {
    const cache = this.caches.get(cacheName);
    const config = this.configs.get(cacheName);
    
    if (!cache || !config) return;

    const now = Date.now();

    // Rimuovi elementi scaduti
    const validItems = cache.filter(item => now - item.timestamp <= config.maxAge);
    
    // Se ancora troppi elementi, rimuovi quelli meno importanti
    if (validItems.length > config.maxSize) {
      switch (config.strategy) {
        case 'lru':
          validItems.sort((a, b) => a.lastAccess - b.lastAccess);
          break;
        case 'lfu':
          validItems.sort((a, b) => a.accessCount - b.accessCount);
          break;
        case 'fifo':
          validItems.sort((a, b) => a.timestamp - b.timestamp);
          break;
      }
      
      // Mantieni solo i primi maxSize elementi
      validItems.splice(config.maxSize);
    }

    this.caches.set(cacheName, validItems);
  }

  cleanupAllCaches(): void {
    this.caches.forEach((_, cacheName) => {
      this.cleanupCache(cacheName);
    });
  }

  private applyCacheStrategy(cacheName: string, config: CacheConfig): void {
    const cache = this.caches.get(cacheName);
    if (!cache) return;

    switch (config.strategy) {
      case 'lru':
        // Least Recently Used - ordina per ultimo accesso
        cache.sort((a, b) => a.lastAccess - b.lastAccess);
        break;
      case 'lfu':
        // Least Frequently Used - ordina per numero di accessi
        cache.sort((a, b) => a.accessCount - b.accessCount);
        break;
      case 'fifo':
        // First In First Out - ordina per timestamp
        cache.sort((a, b) => a.timestamp - b.timestamp);
        break;
    }
  }

  private reorderLRU(cacheName: string, accessedItem: CacheItem): void {
    const cache = this.caches.get(cacheName);
    if (!cache) return;

    // Sposta l'elemento accesso in fondo (più recente)
    const index = cache.indexOf(accessedItem);
    if (index > -1) {
      cache.splice(index, 1);
      cache.push(accessedItem);
    }
  }

  getCacheStats(cacheName: string): { size: number; hitRate: number; avgAge: number } | null {
    const cache = this.caches.get(cacheName);
    if (!cache) return null;

    const now = Date.now();
    const totalAge = cache.reduce((sum, item) => sum + (now - item.timestamp), 0);
    const avgAge = cache.length > 0 ? totalAge / cache.length : 0;

    return {
      size: cache.length,
      hitRate: 0, // Calcolato dinamicamente
      avgAge
    };
  }

  getAllCacheStats(): Record<string, { size: number; hitRate: number; avgAge: number }> {
    const stats: Record<string, { size: number; hitRate: number; avgAge: number }> = {};
    
    this.caches.forEach((_, cacheName) => {
      const cacheStats = this.getCacheStats(cacheName);
      if (cacheStats) {
        stats[cacheName] = cacheStats;
      }
    });
    
    return stats;
  }

  clearCache(cacheName: string): void {
    this.caches.set(cacheName, []);
  }

  clearAllCaches(): void {
    this.caches.clear();
  }

  addCacheConfig(config: CacheConfig): void {
    this.configs.set('default', config);
  }

  getCacheConfig(cacheName: string): CacheConfig | undefined {
    return this.configs.get(cacheName);
  }

  has(cacheName: string, key: string): boolean {
    const cache = this.caches.get(cacheName);
    if (!cache) return false;

    const item = cache.find(item => item.key === key);
    if (!item) return false;

    // Verifica se l'elemento è scaduto
    const config = this.configs.get(cacheName);
    if (config && Date.now() - item.timestamp > config.maxAge) {
      this.remove(cacheName, key);
      return false;
    }

    return true;
  }

  getKeys(cacheName: string): string[] {
    const cache = this.caches.get(cacheName);
    if (!cache) return [];

    return cache.map(item => item.key);
  }

  getSize(cacheName: string): number {
    const cache = this.caches.get(cacheName);
    return cache ? cache.length : 0;
  }

  getTotalSize(): number {
    let total = 0;
    this.caches.forEach(cache => {
      total += cache.length;
    });
    return total;
  }
}

// Istanza globale del cache manager
export const cacheManager = new CacheManager();

// Funzioni di utilità per il caching
export function cachedApiCall<T>(
  cacheName: string,
  key: string,
  apiCall: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  // Prova a recuperare dalla cache
  const cached = cacheManager.get<T>(cacheName, key);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  // Se non in cache, esegui la chiamata API
  return apiCall().then(result => {
    // Salva il risultato in cache
    cacheManager.set(cacheName, key, result);
    return result;
  });
}

export function preloadResource(url: string, type: 'image' | 'script' | 'style' | 'font'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = type;
  
  if (type === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    observer.observe(img);
  } else {
    // Fallback per browser che non supportano IntersectionObserver
    img.src = src;
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Hook per React
export function useCache<T>(cacheName: string, key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = React.useState<T>(() => {
    return cacheManager.get<T>(cacheName, key) || defaultValue;
  });

  const setCachedValue = React.useCallback((newValue: T) => {
    setValue(newValue);
    cacheManager.set(cacheName, key, newValue);
  }, [cacheName, key]);

  return [value, setCachedValue];
}

export default cacheManager;
