import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from 'firebase/messaging';

const firebaseConfig = {
  // Aquí deberás reemplazar estos valores con los de tu proyecto de Firebase
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de Auth y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configurar Firebase Cloud Messaging
let messaging: any = null;

// Registrar service worker de Firebase Messaging
const registerFirebaseMessagingSW =
  async (): Promise<ServiceWorkerRegistration | null> => {
    try {
      if ('serviceWorker' in navigator) {
        // Registrar el service worker de Firebase Messaging
        const registration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        );
        console.log(
          '✅ Firebase Messaging Service Worker registrado:',
          registration
        );
        return registration;
      } else {
        console.log('⚠️ Service Worker no soportado');
        return null;
      }
    } catch (error) {
      console.error('❌ Error registrando Firebase Messaging SW:', error);
      return null;
    }
  };

// Inicializar messaging solo si es soportado
type TokenCallback = (token: string | null) => void;

const initializeMessaging = async (onToken?: TokenCallback) => {
  try {
    const supported = await isSupported();
    if (supported) {
      // Registrar el service worker de Firebase Messaging primero
      const swRegistration = await registerFirebaseMessagingSW();

      if (swRegistration) {
        messaging = getMessaging(app);
        console.log('✅ Firebase Cloud Messaging inicializado');

        // Obtener el token de notificaciones push
        if (onToken) {
          const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
          if (!vapidKey) {
            console.error('❌ VAPID key no configurada');
            onToken(null);
            return;
          }

          getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: swRegistration,
          })
            .then(currentToken => {
              if (currentToken) {
                console.log('✅ Token FCM obtenido:', currentToken);
                onToken(currentToken);
              } else {
                console.log('⚠️ No se pudo obtener el token FCM');
                onToken(null);
              }
            })
            .catch(err => {
              console.error('❌ Error obteniendo token FCM:', err);
              onToken(null);
            });
        }
      } else {
        console.error(
          '❌ No se pudo registrar el Service Worker de Firebase Messaging'
        );
      }
    } else {
      console.log('⚠️ Firebase Cloud Messaging no soportado en este navegador');
    }
  } catch (error) {
    console.error('❌ Error inicializando Firebase Cloud Messaging:', error);
  }
};

// Exportar messaging
export const getMessagingInstance = () => messaging;
export { initializeMessaging, getToken, onMessage };

// Configuración para mejorar la entrega de emails
// Nota: Estas configuraciones se aplican automáticamente en producción
// Para desarrollo, puedes usar el emulador si es necesario
if (
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_USE_AUTH_EMULATOR === 'true'
) {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export default app;
