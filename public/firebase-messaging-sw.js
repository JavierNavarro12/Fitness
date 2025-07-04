/* eslint-disable no-undef, no-restricted-globals */
// Firebase Messaging Service Worker
// Este archivo maneja las notificaciones en background

importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

// Configuración de Firebase (usar variables de entorno en producción)
const firebaseConfig = {
  apiKey: 'tu-api-key',
  authDomain: 'tu-project.firebaseapp.com',
  projectId: 'tu-project-id',
  storageBucket: 'tu-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'tu-app-id',
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener instancia de messaging
const messaging = firebase.messaging();

// Manejar mensajes en background
messaging.onBackgroundMessage(payload => {
  console.log('📨 Mensaje en background recibido:', payload);

  const { title, body, icon, image } = payload.notification || {};

  const notificationTitle = title || 'EGN Fitness';
  const notificationOptions = {
    body: body || 'Tienes una nueva notificación',
    icon: icon || '/logo-192.png',
    badge: '/logo-96.png',
    tag: 'egn-background-notification',
    data: {
      ...payload.data,
      timestamp: Date.now(),
      click_action: payload.data?.click_action || '/',
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
      },
      {
        action: 'close',
        title: 'Cerrar',
      },
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
  };

  // Mostrar notificación
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clicks en notificaciones
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

  // Determinar URL de destino
  let urlToOpen = '/';

  if (data.click_action) {
    urlToOpen = data.click_action;
  } else if (data.type === 'report') {
    urlToOpen = '/reports';
  } else if (data.type === 'supplement') {
    urlToOpen = '/custom';
  } else if (action === 'open') {
    urlToOpen = '/';
  }

  // Abrir/enfocar ventana de la app
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Buscar si ya hay una ventana abierta
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            // Si encontramos una ventana, enfocarla y navegar
            client.navigate(urlToOpen);
            return client.focus();
          }
        }

        // Si no hay ventana abierta, abrir una nueva
        return clients.openWindow(urlToOpen);
      })
  );
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', event => {
  console.log('❌ Notificación cerrada:', event.notification.tag);

  // Aquí podrías enviar analytics sobre notificaciones cerradas
  const data = event.notification.data || {};

  if (data.type === 'supplement') {
    console.log('📊 Usuario cerró recordatorio de suplemento');
  }
});

console.log('✅ Firebase Messaging Service Worker registrado');
