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

// Inicializar messaging solo si es soportado
const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      console.log('✅ Firebase Cloud Messaging inicializado');
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
