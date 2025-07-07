/* eslint-disable no-undef, no-restricted-globals */
// Firebase Messaging Service Worker
// Este archivo maneja las notificaciones en background

importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js'
);

// Función para obtener variables de entorno desde la aplicación principal
const getEnvVariable = (name, fallback = '') => {
  // En un service worker, no tenemos acceso directo a process.env
  // Por lo que necesitamos usar una estrategia diferente

  // Verificar si las variables están disponibles en el contexto global
  if (typeof self[name] !== 'undefined') {
    return self[name];
  }

  // Si no están disponibles, intentar obtenerlas desde localStorage
  // (esto requiere que la aplicación principal las haya guardado)
  try {
    return localStorage.getItem(name) || fallback;
  } catch (error) {
    console.warn(`No se pudo obtener la variable de entorno ${name}:`, error);
    return fallback;
  }
};

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: getEnvVariable('REACT_APP_FIREBASE_API_KEY'),
  authDomain: getEnvVariable('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVariable('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVariable('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVariable('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVariable('REACT_APP_FIREBASE_APP_ID'),
};

// Validar que la configuración esté completa
const isConfigValid = Object.values(firebaseConfig).every(
  value => value && value.trim() !== ''
);

if (!isConfigValid) {
  console.error(
    '❌ Configuración de Firebase incompleta en el Service Worker:',
    firebaseConfig
  );
  console.error(
    '❌ Asegúrate de que las variables de entorno estén configuradas correctamente'
  );
} else {
  console.log(
    '✅ Configuración de Firebase cargada correctamente en el Service Worker'
  );
}

// Inicializar Firebase solo si la configuración es válida
if (isConfigValid) {
  firebase.initializeApp(firebaseConfig);

  // Obtener instancia de messaging
  const messaging = firebase.messaging();

  // Manejar mensajes en background
  messaging.onBackgroundMessage(payload => {
    console.log('📨 Mensaje en background recibido:', payload);

    const { title, body, icon, image } = payload.notification || {};
    const notificationData = payload.data || {};

    const notificationTitle = title || 'EGN Fitness';
    const notificationOptions = {
      body: body || 'Tienes una nueva notificación',
      icon: icon || '/logo-192.png',
      badge: '/logo-96.png',
      tag: notificationData.tag || 'egn-background-notification',
      data: {
        ...notificationData,
        timestamp: Date.now(),
        click_action: notificationData.click_action || '/',
        originalPayload: payload,
      },
      actions: [
        {
          action: 'open',
          title: 'Abrir App',
          icon: '/logo-96.png',
        },
        {
          action: 'close',
          title: 'Cerrar',
        },
      ],
      requireInteraction: true,
      vibrate: [200, 100, 200],
      image: image,
      // Configuraciones adicionales para mejor UX
      silent: false,
      renotify: true,
    };

    // Añadir acciones específicas según el tipo de notificación
    if (notificationData.type === 'supplement') {
      notificationOptions.actions = [
        { action: 'mark-taken', title: '✅ Tomado', icon: '/logo-96.png' },
        { action: 'remind-later', title: '⏰ Recordar luego' },
        { action: 'close', title: 'Cerrar' },
      ];
    } else if (notificationData.type === 'report') {
      notificationOptions.actions = [
        {
          action: 'view-report',
          title: '👁️ Ver Reporte',
          icon: '/logo-96.png',
        },
        { action: 'share', title: '📤 Compartir' },
        { action: 'close', title: 'Cerrar' },
      ];
    }

    // Mostrar notificación
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('🖱️ Click en notificación:', event);

  const action = event.action;
  const notification = event.notification;
  const data = notification.data || {};

  // Cerrar notificación
  notification.close();

  // Manejar acción de cerrar
  if (action === 'close') {
    console.log('🔄 Notificación cerrada por el usuario');
    return;
  }

  // Determinar URL de destino basado en la acción y el tipo
  let urlToOpen = '/';

  switch (action) {
    case 'mark-taken':
      // Enviar mensaje a la aplicación para marcar suplemento como tomado
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SUPPLEMENT_TAKEN',
            supplement: data.supplement,
            timestamp: Date.now(),
          });
        });
      });
      return;

    case 'remind-later':
      // Programar recordatorio para 15 minutos después
      self.registration.showNotification('⏰ Recordatorio programado', {
        body: 'Te recordaremos en 15 minutos',
        tag: 'remind-later',
        icon: '/logo-192.png',
        badge: '/logo-96.png',
      });

      setTimeout(
        () => {
          self.registration.showNotification(notification.title, {
            ...notification,
            tag: 'supplement-reminder-delayed',
          });
        },
        15 * 60 * 1000
      ); // 15 minutos
      return;

    case 'view-report':
    case 'open':
      if (data.click_action) {
        urlToOpen = data.click_action;
      } else if (data.type === 'report') {
        urlToOpen = '/reports';
      } else if (data.type === 'supplement') {
        urlToOpen = '/';
      }
      break;

    case 'share':
      // Abrir Web Share API si está disponible
      if (navigator.share && data.type === 'report') {
        navigator
          .share({
            title: 'Mi Reporte EGN Fitness',
            text: 'Mira mi reporte personalizado de fitness',
            url: `${self.location.origin}/reports`,
          })
          .catch(err => console.log('Error sharing:', err));
        return;
      }
      urlToOpen = '/reports';
      break;

    default:
      // Click en el cuerpo de la notificación
      if (data.click_action) {
        urlToOpen = data.click_action;
      } else if (data.type === 'report') {
        urlToOpen = '/reports';
      } else if (data.type === 'supplement') {
        urlToOpen = '/';
      }
  }

  // Abrir/enfocar ventana de la app
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Buscar si ya hay una ventana abierta de la app
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            // Si encontramos una ventana, navegar y enfocarla
            if (urlToOpen !== client.url) {
              client.navigate(urlToOpen);
            }
            return client.focus();
          }
        }

        // Si no hay ventana abierta, abrir una nueva
        return self.clients.openWindow(urlToOpen);
      })
      .catch(error => {
        console.error('❌ Error abriendo ventana:', error);
      })
  );
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', event => {
  console.log('❌ Notificación cerrada:', event.notification.tag);

  const data = event.notification.data || {};

  // Enviar analytics sobre notificaciones cerradas
  if (data.type === 'supplement') {
    console.log(
      '📊 Usuario cerró recordatorio de suplemento:',
      data.supplement
    );
  } else if (data.type === 'report') {
    console.log('📊 Usuario cerró notificación de reporte');
  }

  // Notificar a la aplicación principal sobre el cierre
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION_CLOSED',
        notificationTag: event.notification.tag,
        notificationType: data.type,
        timestamp: Date.now(),
      });
    });
  });
});

// Manejar activación del service worker
self.addEventListener('activate', event => {
  console.log('✅ Firebase Messaging Service Worker activado');

  // Limpiar notificaciones antiguas al activar
  event.waitUntil(
    self.registration.getNotifications().then(notifications => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

      notifications.forEach(notification => {
        const timestamp = notification.data?.timestamp || 0;
        if (timestamp < oneDayAgo) {
          notification.close();
        }
      });

      console.log('🧹 Notificaciones antiguas limpiadas');
    })
  );
});

// Manejar instalación del service worker
self.addEventListener('install', event => {
  console.log('🔧 Firebase Messaging Service Worker instalado');
  self.skipWaiting();
});

// Manejar mensajes desde la aplicación principal
self.addEventListener('message', event => {
  console.log('💬 Mensaje recibido en SW:', event.data);

  if (event.data && event.data.type === 'SET_ENV_VARS') {
    // Guardar variables de entorno enviadas por la aplicación principal
    const envVars = event.data.envVars;
    Object.keys(envVars).forEach(key => {
      try {
        localStorage.setItem(key, envVars[key]);
      } catch (error) {
        console.warn(`No se pudo guardar ${key}:`, error);
      }
    });
    console.log('✅ Variables de entorno actualizadas en SW');
  }
});

console.log('✅ Firebase Messaging Service Worker registrado correctamente');
