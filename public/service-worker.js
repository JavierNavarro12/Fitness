// Service Worker básico para PWA
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Puedes personalizar el cacheo aquí si lo deseas
}); 