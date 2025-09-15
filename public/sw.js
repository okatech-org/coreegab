const CACHE_NAME = 'coregab-v1.0.3-dev';
const STATIC_CACHE = 'coregab-static-v1.0.3-dev';
const DYNAMIC_CACHE = 'coregab-dynamic-v1.0.3-dev';

// Ressources critiques à mettre en cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/placeholder.svg',
  '/placeholder-headphones.svg',
  '/placeholder-appliance.svg',
  '/placeholder-phone.svg',
  '/placeholder-tv.svg',
  '/placeholder-car.svg',
  '/placeholder-parts.svg'
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
      // Nettoyer les anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Ne garder que les caches actuels
            if (!cacheName.startsWith('coregab-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ])
  );
});

// Stratégie de gestion des requêtes optimisée
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes vers Supabase et autres APIs externes
  if (url.hostname.includes('supabase.co') || 
      url.hostname.includes('stripe.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('js.stripe.com')) {
    return; // Laisser le navigateur gérer ces requêtes
  }
  
  // Pour les ressources statiques, utiliser cache first
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
  
  // Pour les pages HTML, utiliser network first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }
  
  // Pour les autres requêtes, utiliser network first avec cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        // Mettre en cache les réponses réussies (seulement pour les requêtes GET)
        if (response.status === 200 && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(error => {
        console.log('[SW] Network failed, trying cache:', request.url);
        return caches.match(request).then(cached => {
          if (cached) {
            return cached;
          }
          return new Response('Offline', { status: 503 });
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
    
    if (response.status === 200 && request.method === 'GET') {
      const responseClone = response.clone();
      const cache = await caches.open(cacheName);
      cache.put(request, responseClone);
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
    body: event.data ? event.data.text() : 'Nouvelle notification de COREEGAB',
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
    self.registration.showNotification('COREEGAB', options)
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