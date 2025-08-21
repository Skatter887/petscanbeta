// Service Worker per PetScan - Caching e Performance
const CACHE_NAME = 'petscan-v1.0.0';
const STATIC_CACHE = 'petscan-static-v1.0.0';
const DYNAMIC_CACHE = 'petscan-dynamic-v1.0.0';

// Risorse da cacheare immediatamente
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/petscan-logo.png',
  '/favicon.ico',
  '/apple-touch-icon.png'
];

// Strategie di caching
const CACHE_STRATEGIES = {
  // Cache-First per risorse statiche
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error('Cache-first strategy failed:', error);
      return new Response('Network error', { status: 503 });
    }
  },

  // Network-First per API
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      return new Response('Network error', { status: 503 });
    }
  },

  // Stale-While-Revalidate per contenuti dinamici
  staleWhileRevalidate: async (request) => {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(() => cachedResponse);

    return cachedResponse || fetchPromise;
  }
};

// Install event - cache delle risorse statiche
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - pulizia cache vecchie
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - gestione delle richieste
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora richieste non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignora richieste a domini esterni
  if (url.origin !== location.origin) {
    return;
  }

  // Strategia per HTML (stale-while-revalidate)
  if (request.destination === 'document') {
    event.respondWith(CACHE_STRATEGIES.staleWhileRevalidate(request));
    return;
  }

  // Strategia per script e CSS (cache-first)
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(CACHE_STRATEGIES.cacheFirst(request));
    return;
  }

  // Strategia per immagini (cache-first)
  if (request.destination === 'image') {
    event.respondWith(CACHE_STRATEGIES.cacheFirst(request));
    return;
  }

  // Strategia per font (cache-first)
  if (request.destination === 'font') {
    event.respondWith(CACHE_STRATEGIES.cacheFirst(request));
    return;
  }

  // Strategia per API (network-first)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(CACHE_STRATEGIES.networkFirst(request));
    return;
  }

  // Strategia di default (stale-while-revalidate)
  event.respondWith(CACHE_STRATEGIES.staleWhileRevalidate(request));
});

// Background sync per richieste offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Esegui sincronizzazione in background
      console.log('Background sync triggered')
    );
  }
});

// Push notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nuova notifica da PetScan',
    icon: '/petscan-logo.png',
    badge: '/petscan-logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Apri App',
        icon: '/petscan-logo.png'
      },
      {
        action: 'close',
        title: 'Chiudi',
        icon: '/petscan-logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('PetScan', options)
  );
});

// Click su notifica
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Gestione errori del Service Worker
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

// Messaggi dal client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Funzione per aggiornare la cache
async function updateCache() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const requests = STATIC_ASSETS.map(url => new Request(url));
    const responses = await Promise.all(
      requests.map(request => fetch(request))
    );
    
    responses.forEach((response, index) => {
      if (response.ok) {
        cache.put(requests[index], response);
      }
    });
    
    console.log('Cache updated successfully');
  } catch (error) {
    console.error('Failed to update cache:', error);
  }
}

// Aggiorna la cache ogni ora
setInterval(updateCache, 3600000);
