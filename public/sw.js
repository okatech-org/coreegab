const CACHE_NAME = 'coregab-v1.0.1-dev';
const STATIC_CACHE = 'coregab-static-v1-dev';
const DYNAMIC_CACHE = 'coregab-dynamic-v1-dev';

// Ressources critiques à mettre en cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Ressources à mettre en cache dynamiquement
const DYNAMIC_RESOURCES = [
  '/boutique',
  '/calculator',
  '/client-dashboard',
  '/commercial-dashboard',
  '/admin-dashboard'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_RESOURCES.map(url => new Request(url, { cache: 'reload' })));
      }).catch((error) => {
        console.warn('[SW] Failed to cache some static resources:', error);
      }),
      
      // Pré-cache des routes importantes
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('[SW] Pre-caching dynamic routes');
        return cache.addAll(DYNAMIC_RESOURCES.map(url => new Request(url, { cache: 'reload' })));
      }).catch((error) => {
        console.warn('[SW] Failed to pre-cache some routes:', error);
      })
    ])
  );
  
  // Force l'activation immédiate
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    Promise.all([
      // DÉVELOPPEMENT : Vider TOUS les caches pour éviter les problèmes
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[SW] Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ])
  );
});

// Stratégie de gestion des requêtes - DÉSACTIVÉ POUR LE DÉVELOPPEMENT
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // MODE DÉVELOPPEMENT : Toujours aller chercher sur le réseau
  // Cela permet de voir immédiatement les modifications
  event.respondWith(
    fetch(request)
      .then(response => {
        console.log('[SW] Fetching from network:', request.url);
        return response;
      })
      .catch(error => {
        console.error('[SW] Network request failed:', error);
        // En cas d'échec réseau, essayer le cache comme fallback
        return caches.match(request).then(cached => {
          if (cached) {
            console.log('[SW] Fallback to cache:', request.url);
            return cached;
          }
          return new Response('Network error', { status: 503 });
        });
      })
  );
});

// Stratégie Cache First (pour les ressources statiques)
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('[SW] Serving from cache:', request.url);
      return cached;
    }
    
    console.log('[SW] Fetching and caching:', request.url);
    const response = await fetch(request);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

// Stratégie Network First (pour les pages et APIs)
async function networkFirst(request, cacheName) {
  try {
    console.log('[SW] Trying network first:', request.url);
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Page hors-ligne de fallback
    if (request.mode === 'navigate') {
      const fallback = await cache.match('/');
      if (fallback) {
        return fallback;
      }
    }
    
    return new Response('Content not available offline', { status: 503 });
  }
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Logique de synchronisation des données
    console.log('[SW] Performing background sync');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification de COREGAB',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir plus',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('COREGAB', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});