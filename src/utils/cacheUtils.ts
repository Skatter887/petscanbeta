// Utilità per la gestione del caching e delle performance
export interface CacheConfig {
  name: string;
  maxAge: number;
  maxSize: number;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

export interface CacheItem {
  key: string;
  value: any;
  timestamp: number;
  size: number;
}

class CacheManager {
  private caches: Map<string, CacheItem[]> = new Map();
  private configs: Map<string, CacheConfig> = new Map();

  constructor() {
    this.initDefaultConfigs();
  }

  private initDefaultConfigs(): void {
    // Configurazione per risorse statiche
    this.configs.set('static', {
      name: 'static',
      maxAge: 31536000000, // 1 anno
      maxSize: 100,
      strategy: 'cache-first'
    });

    // Configurazione per risorse dinamiche
    this.configs.set('dynamic', {
      name: 'dynamic',
      maxAge: 86400000, // 1 giorno
      maxSize: 50,
      strategy: 'network-first'
    });

    // Configurazione per API calls
    this.configs.set('api', {
      name: 'api',
      maxAge: 300000, // 5 minuti
      maxSize: 100,
      strategy: 'stale-while-revalidate'
    });
  }

  // Aggiungi un elemento alla cache
  set(cacheName: string, key: string, value: any, size: number = 1): void {
    const config = this.configs.get(cacheName);
    if (!config) {
      console.warn(`Cache config not found for: ${cacheName}`);
      return;
    }

    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, []);
    }

    const cache = this.caches.get(cacheName)!;
    const existingIndex = cache.findIndex(item => item.key === key);

    const item: CacheItem = {
      key,
      value,
      timestamp: Date.now(),
      size
    };

    if (existingIndex >= 0) {
      // Aggiorna elemento esistente
      cache[existingIndex] = item;
    } else {
      // Aggiungi nuovo elemento
      cache.push(item);
    }

    // Pulisci cache se necessario
    this.cleanupCache(cacheName);
  }

  // Ottieni un elemento dalla cache
  get(cacheName: string, key: string): any | null {
    const cache = this.caches.get(cacheName);
    if (!cache) return null;

    const item = cache.find(item => item.key === key);
    if (!item) return null;

    const config = this.configs.get(cacheName);
    if (!config) return null;

    // Verifica se l'elemento è scaduto
    if (Date.now() - item.timestamp > config.maxAge) {
      this.remove(cacheName, key);
      return null;
    }

    return item.value;
  }

  // Rimuovi un elemento dalla cache
  remove(cacheName: string, key: string): boolean {
    const cache = this.caches.get(cacheName);
    if (!cache) return false;

    const index = cache.findIndex(item => item.key === key);
    if (index >= 0) {
      cache.splice(index, 1);
      return true;
    }

    return false;
  }

  // Pulisci una cache specifica
  cleanupCache(cacheName: string): void {
    const cache = this.caches.get(cacheName);
    const config = this.configs.get(cacheName);
    
    if (!cache || !config) return;

    const now = Date.now();

    // Rimuovi elementi scaduti
    const validItems = cache.filter(item => now - item.timestamp <= config.maxAge);

    // Se la cache è ancora troppo grande, rimuovi gli elementi più vecchi
    if (validItems.length > config.maxSize) {
      validItems.sort((a, b) => a.timestamp - b.timestamp);
      validItems.splice(0, validItems.length - config.maxSize);
    }

    this.caches.set(cacheName, validItems);
  }

  // Pulisci tutte le cache
  cleanupAllCaches(): void {
    this.configs.forEach((config, name) => {
      this.cleanupCache(name);
    });
  }

  // Ottieni statistiche della cache
  getCacheStats(cacheName: string): { size: number; hitRate: number; avgAge: number } | null {
    const cache = this.caches.get(cacheName);
    if (!cache) return null;

    const now = Date.now();
    const totalSize = cache.reduce((sum, item) => sum + item.size, 0);
    const avgAge = cache.reduce((sum, item) => sum + (now - item.timestamp), 0) / cache.length;

    return {
      size: totalSize,
      hitRate: 0, // TODO: Implementare hit rate tracking
      avgAge
    };
  }

  // Ottieni statistiche di tutte le cache
  getAllCacheStats(): Record<string, { size: number; hitRate: number; avgAge: number }> {
    const stats: Record<string, { size: number; hitRate: number; avgAge: number }> = {};
    
    this.configs.forEach((config, name) => {
      const stat = this.getCacheStats(name);
      if (stat) {
        stats[name] = stat;
      }
    });

    return stats;
  }

  // Svuota una cache specifica
  clearCache(cacheName: string): void {
    this.caches.set(cacheName, []);
  }

  // Svuota tutte le cache
  clearAllCaches(): void {
    this.caches.clear();
  }

  // Aggiungi una nuova configurazione di cache
  addCacheConfig(config: CacheConfig): void {
    this.configs.set(config.name, config);
  }

  // Ottieni una configurazione di cache
  getCacheConfig(cacheName: string): CacheConfig | undefined {
    return this.configs.get(cacheName);
  }

  // Verifica se una chiave esiste nella cache
  has(cacheName: string, key: string): boolean {
    const cache = this.caches.get(cacheName);
    if (!cache) return false;

    const item = cache.find(item => item.key === key);
    if (!item) return false;

    const config = this.configs.get(cacheName);
    if (!config) return false;

    // Verifica se l'elemento è scaduto
    if (Date.now() - item.timestamp > config.maxAge) {
      this.remove(cacheName, key);
      return false;
    }

    return true;
  }

  // Ottieni tutte le chiavi di una cache
  getKeys(cacheName: string): string[] {
    const cache = this.caches.get(cacheName);
    if (!cache) return [];

    return cache.map(item => item.key);
  }

  // Ottieni la dimensione di una cache
  getSize(cacheName: string): number {
    const cache = this.caches.get(cacheName);
    if (!cache) return 0;

    return cache.length;
  }

  // Ottieni la dimensione totale di tutte le cache
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
export function cacheGet(cacheName: string, key: string): any | null {
  return cacheManager.get(cacheName, key);
}

export function cacheSet(cacheName: string, key: string, value: any, size: number = 1): void {
  cacheManager.set(cacheName, key, value, size);
}

export function cacheHas(cacheName: string, key: string): boolean {
  return cacheManager.has(cacheName, key);
}

export function cacheRemove(cacheName: string, key: string): boolean {
  return cacheManager.remove(cacheName, key);
}

export function cacheClear(cacheName: string): void {
  cacheManager.clearCache(cacheName);
}

export function cacheStats(cacheName: string) {
  return cacheManager.getCacheStats(cacheName);
}

// Funzione per il caching intelligente delle API calls
export async function cachedApiCall<T>(
  cacheName: string,
  key: string,
  apiCall: () => Promise<T>,
  maxAge?: number
): Promise<T> {
  // Verifica se esiste in cache
  const cached = cacheGet(cacheName, key);
  if (cached) {
    return cached;
  }

  // Esegui la chiamata API
  try {
    const result = await apiCall();
    
    // Salva in cache
    cacheSet(cacheName, key, result);
    
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Funzione per il preloading delle risorse
export function preloadResource(url: string, type: 'image' | 'script' | 'style' | 'font'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
    case 'font':
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      break;
  }
  
  document.head.appendChild(link);
}

// Funzione per il lazy loading delle immagini
export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
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
