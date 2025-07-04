/* eslint-disable no-undef, no-restricted-globals */
const CACHE_NAME = 'egn-fitness-v1.3.0';
const OFFLINE_CACHE = 'egn-offline-v1.0.0';

// Recursos críticos para precaching
const PRECACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo-192.png',
  '/logo-512.png',
  '/fitness-1.webp',
  '/fitness-2.webp',
  '/fitness-3.webp',
  '/logo-app.webp',
];

// Páginas para funcionalidad offline
const OFFLINE_PAGES = ['/', '/faq', '/contact', '/privacy', '/terms'];

// Instalar SW y precachear recursos
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache recursos críticos
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Precaching recursos críticos...');
        return cache.addAll(
          PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' }))
        );
      }),
      // Cache páginas offline
      caches.open(OFFLINE_CACHE).then(cache => {
        console.log('📱 Caching páginas offline...');
        return cache.addAll(OFFLINE_PAGES);
      }),
    ]).then(() => {
      console.log('✅ Service Worker instalado y recursos cacheados');
      // eslint-disable-next-line no-restricted-globals
      self.skipWaiting();
    })
  );
});

// Activar SW y limpiar caches antiguos
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const deletePromises = cacheNames
        .filter(
          name =>
            name.startsWith('egn-') &&
            name !== CACHE_NAME &&
            name !== OFFLINE_CACHE
        )
        .map(name => {
          console.log('🗑️ Eliminando cache antiguo:', name);
          return caches.delete(name);
        });

      return Promise.all(deletePromises).then(() => {
        console.log('✅ Service Worker activado');
        // eslint-disable-next-line no-restricted-globals
        self.clients.claim();
      });
    })
  );
});

// Estrategia de fetch con cache inteligente
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar requests del mismo origen
  // eslint-disable-next-line no-restricted-globals
  if (url.origin !== location.origin) {
    return;
  }

  // Estrategia Cache First para recursos estáticos
  if (isStaticResource(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estrategia Network First para páginas HTML
  if (isHTMLPage(request)) {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Estrategia Network First para APIs
  if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: pasar al navegador
});

// Cache First: Perfecto para recursos estáticos
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Cache First falló:', error);
    return new Response('Recurso no disponible offline', { status: 503 });
  }
}

// Network First con fallback offline
async function networkFirstWithOffline(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(OFFLINE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🌐 Red no disponible, usando cache...');
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback a página offline personalizada
    return createOfflinePage(request);
  }
}

// Network First para APIs con timeout
async function networkFirst(request) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const networkResponse = await fetch(request, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🌐 API request falló, intentando cache...');
    const cachedResponse = await caches.match(request);
    return (
      cachedResponse ||
      new Response(JSON.stringify({ error: 'Datos no disponibles offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }
}

// Helpers para identificar tipos de request
function isStaticResource(request) {
  const url = new URL(request.url);
  return /\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(url.pathname);
}

function isHTMLPage(request) {
  return (
    request.destination === 'document' ||
    request.headers.get('accept')?.includes('text/html')
  );
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('openai') ||
    url.hostname.includes('contentful') ||
    url.hostname.includes('firebase')
  );
}

// Crear página offline personalizada
function createOfflinePage(request) {
  // eslint-disable-next-line no-unused-vars
  const url = new URL(request.url);
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EGN - Sin conexión</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0; padding: 2rem; text-align: center; background: #f3f4f6;
        }
        .container { max-width: 400px; margin: 4rem auto; }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { color: #dc2626; margin-bottom: 1rem; }
        p { color: #6b7280; margin-bottom: 2rem; }
        button { 
          background: #dc2626; color: white; border: none; 
          padding: 0.75rem 1.5rem; border-radius: 0.5rem; 
          cursor: pointer; font-size: 1rem;
        }
        button:hover { background: #b91c1c; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📱</div>
        <h1>Sin conexión</h1>
        <p>No hay conexión a internet. Esta página se cargará automáticamente cuando se restablezca la conexión.</p>
        <button onclick="window.location.reload()">Intentar de nuevo</button>
      </div>
      <script>
        // Auto-refresh cuando vuelva la conexión
        window.addEventListener('online', () => {
          window.location.reload();
        });
      </script>
    </body>
    </html>
  `;

  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// Comunicación con la app principal
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // eslint-disable-next-line no-restricted-globals
    self.skipWaiting();
  }
});

// ===== NOTIFICACIONES PUSH =====

// Manejar clicks en notificaciones
// eslint-disable-next-line no-restricted-globals
self.addEventListener('notificationclick', event => {
  console.log('🖱️ Click en notificación:', event);

  const action = event.action;
  const notification = event.notification;
  const data = notification.data || {};

  // Cerrar notificación
  notification.close();

  if (action === 'close') {
    return;
  }

  // Determinar URL de destino según el tipo de notificación
  let urlToOpen = '/';

  if (data.click_action) {
    urlToOpen = data.click_action;
  } else if (data.type === 'report') {
    urlToOpen = '/reports';
  } else if (data.type === 'supplement') {
    urlToOpen = '/custom';
  } else if (data.type === 'achievement') {
    urlToOpen = '/reports';
  } else if (action === 'open') {
    urlToOpen = '/';
  }

  // Manejar acciones específicas
  if (action === 'taken' && data.type === 'supplement') {
    // Marcar suplemento como tomado
    console.log('✅ Suplemento marcado como tomado:', data.supplement);
    // Aquí podrías enviar una notificación a la app o guardar el estado
    return;
  }

  if (action === 'snooze' && data.type === 'supplement') {
    // Postponer notificación 15 minutos
    console.log('⏰ Notificación postpone 15 minutos');
    scheduleSnoozeNotification(data);
    return;
  }

  // Abrir/enfocar ventana de la app
  event.waitUntil(
    // eslint-disable-next-line no-restricted-globals
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Buscar si ya hay una ventana abierta
        for (const client of clientList) {
          // eslint-disable-next-line no-restricted-globals
          if (client.url.includes(self.location.origin)) {
            // Si encontramos una ventana, enfocarla y navegar
            if (client.navigate) {
              client.navigate(urlToOpen);
            }
            return client.focus();
          }
        }

        // Si no hay ventana abierta, abrir una nueva
        // eslint-disable-next-line no-restricted-globals
        return clients.openWindow(urlToOpen);
      })
  );
});

// Manejar cierre de notificaciones
// eslint-disable-next-line no-restricted-globals
self.addEventListener('notificationclose', event => {
  console.log('❌ Notificación cerrada:', event.notification.tag);

  const data = event.notification.data || {};

  // Analytics sobre notificaciones cerradas
  if (data.type === 'supplement') {
    console.log('📊 Usuario cerró recordatorio de suplemento sin interactuar');
  } else if (data.type === 'report') {
    console.log('📊 Usuario cerró notificación de reporte');
  }
});

// Función para postponer notificaciones
function scheduleSnoozeNotification(data) {
  // En una implementación real, esto se haría con un servidor
  // Aquí simulamos con setTimeout
  setTimeout(
    () => {
      // eslint-disable-next-line no-restricted-globals
      self.registration.showNotification(
        `⏰ Recordatorio: ${data.supplement}`,
        {
          body: 'No olvides tomar tu suplemento',
          icon: '/logo-192.png',
          badge: '/logo-96.png',
          tag: `snooze-${data.supplement}`,
          data: data,
          actions: [
            { action: 'taken', title: '✅ Tomado' },
            { action: 'snooze', title: '⏰ 15 min más' },
          ],
          requireInteraction: true,
          vibrate: [200, 100, 200],
        }
      );
    },
    15 * 60 * 1000
  ); // 15 minutos
}

console.log('🚀 EGN Service Worker con notificaciones cargado exitosamente');
