import {
  initializeMessaging,
  getMessagingInstance,
  getToken,
  onMessage,
} from '../firebase';
import { UserProfile } from '../types';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  vibrate?: number[];
  requireInteraction?: boolean;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Interface extendida para opciones de notificación
interface ExtendedNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  vibrate?: number[];
  requireInteraction?: boolean;
  silent?: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private messaging: any = null;
  private vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Inicializar el servicio de notificaciones
   */
  async initialize(): Promise<boolean> {
    try {
      // Verificar soporte del navegador
      if (!('Notification' in window)) {
        console.log('⚠️ Este navegador no soporta notificaciones');
        return false;
      }

      // Verificar si es PWA
      if (!('serviceWorker' in navigator)) {
        console.log('⚠️ Service Worker no soportado');
        return false;
      }

      // Enviar variables de entorno al service worker
      await this.sendEnvVarsToServiceWorker();

      // Inicializar Firebase Messaging
      await initializeMessaging();
      this.messaging = getMessagingInstance();

      if (!this.messaging) {
        console.log('⚠️ Firebase Cloud Messaging no disponible');
        return false;
      }

      // Configurar listener para mensajes en primer plano
      this.setupForegroundListener();

      // Configurar listener para mensajes del service worker
      this.setupServiceWorkerListener();

      console.log('✅ Servicio de notificaciones inicializado');
      return true;
    } catch (error) {
      console.error(
        '❌ Error inicializando servicio de notificaciones:',
        error
      );
      return false;
    }
  }

  /**
   * Enviar variables de entorno al service worker
   */
  private async sendEnvVarsToServiceWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;

      const envVars = {
        REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
        REACT_APP_FIREBASE_AUTH_DOMAIN:
          process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        REACT_APP_FIREBASE_PROJECT_ID:
          process.env.REACT_APP_FIREBASE_PROJECT_ID,
        REACT_APP_FIREBASE_STORAGE_BUCKET:
          process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID:
          process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
        REACT_APP_FIREBASE_VAPID_KEY: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      };

      // Filtrar valores undefined/null
      const validEnvVars = Object.entries(envVars).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      // Enviar al service worker
      registration.active?.postMessage({
        type: 'SET_ENV_VARS',
        envVars: validEnvVars,
      });

      console.log('✅ Variables de entorno enviadas al service worker');
    } catch (error) {
      console.error('❌ Error enviando variables de entorno al SW:', error);
    }
  }

  /**
   * Solicitar permisos de notificación
   */
  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('✅ Permisos de notificación concedidos');
        return true;
      } else {
        console.log('❌ Permisos de notificación denegados');
        return false;
      }
    } catch (error) {
      console.error('❌ Error solicitando permisos:', error);
      return false;
    }
  }

  /**
   * Verificar si los permisos están concedidos
   */
  hasPermission(): boolean {
    return Notification.permission === 'granted';
  }

  /**
   * Obtener token de dispositivo para notificaciones push
   */
  async getDeviceToken(): Promise<string | null> {
    try {
      if (!this.messaging || !this.vapidKey) {
        console.log('⚠️ Firebase Messaging o VAPID key no configurados');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: this.vapidKey,
      });

      if (token) {
        console.log('✅ Token de dispositivo obtenido:', token);
        return token;
      } else {
        console.log('❌ No se pudo obtener token de dispositivo');
        return null;
      }
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Mostrar notificación local
   */
  async showNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      if (!this.hasPermission()) {
        console.log('⚠️ No hay permisos para mostrar notificaciones');
        return false;
      }

      const registration = await navigator.serviceWorker.ready;

      const options: ExtendedNotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/logo-192.png',
        badge: payload.badge || '/logo-96.png',
        tag: payload.tag || 'egn-notification',
        data: payload.data,
        actions: payload.actions,
        vibrate: payload.vibrate || [200, 100, 200],
        requireInteraction: payload.requireInteraction || false,
        silent: false,
      };

      await registration.showNotification(
        payload.title,
        options as NotificationOptions
      );
      console.log('✅ Notificación mostrada:', payload.title);
      return true;
    } catch (error) {
      console.error('❌ Error mostrando notificación:', error);
      return false;
    }
  }

  /**
   * Configurar listener para mensajes en primer plano
   */
  private setupForegroundListener(): void {
    if (!this.messaging) return;

    onMessage(this.messaging, payload => {
      console.log('📨 Mensaje recibido en primer plano:', payload);

      const { title, body, icon, image } = payload.notification || {};

      this.showNotification({
        title: title || 'EGN Fitness',
        body: body || 'Tienes una nueva notificación',
        icon: icon || '/logo-192.png',
        image: image,
        data: payload.data,
        tag: 'fcm-notification',
        requireInteraction: true,
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
      });
    });
  }

  /**
   * Generar notificaciones basadas en el perfil del usuario
   */
  generateUserNotifications(userProfile: UserProfile): NotificationPayload[] {
    const notifications: NotificationPayload[] = [];

    // Notificaciones de suplementos
    if (userProfile.currentSupplements.length > 0) {
      notifications.push({
        title: '💊 Recordatorio de Suplementos',
        body: `Tienes ${userProfile.currentSupplements.length} suplementos en tu rutina`,
        tag: 'supplement-reminder',
        data: {
          type: 'supplement',
          supplements: userProfile.currentSupplements,
        },
        actions: [
          { action: 'mark-taken', title: '✅ Tomado' },
          { action: 'remind-later', title: '⏰ Recordar luego' },
        ],
      });
    }

    // Notificaciones según el objetivo
    if (userProfile.objective.toLowerCase().includes('masa')) {
      notifications.push({
        title: '🏋️ Tip para Ganar Masa',
        body: 'Recuerda: la proteína es clave para el crecimiento muscular',
        tag: 'muscle-tip',
        data: { type: 'tip', category: 'muscle' },
      });
    }

    if (userProfile.objective.toLowerCase().includes('peso')) {
      notifications.push({
        title: '🔥 Tip para Quemar Grasa',
        body: 'Mantén tu déficit calórico y sé constante',
        tag: 'fat-loss-tip',
        data: { type: 'tip', category: 'fat-loss' },
      });
    }

    // Notificaciones según el deporte
    if (
      userProfile.sport.includes('gimnasio') ||
      userProfile.sport.includes('fitness')
    ) {
      notifications.push({
        title: '🏋️ Momento Post-Entreno',
        body: 'Hora ideal para tu proteína y creatina',
        tag: 'post-workout',
        data: { type: 'workout', timing: 'post' },
      });
    }

    return notifications;
  }

  /**
   * Notificaciones específicas para diferentes momentos
   */
  async showSupplementReminder(
    supplement: string,
    timing: string
  ): Promise<boolean> {
    const timingEmojis: { [key: string]: string } = {
      morning: '🌅',
      'pre-workout': '🏋️',
      'post-workout': '💪',
      evening: '🌙',
      'with-meal': '🍽️',
    };

    const emoji = timingEmojis[timing] || '💊';

    return this.showNotification({
      title: `${emoji} Hora de tomar ${supplement}`,
      body: `Recordatorio: ${timing.replace('-', ' ')}`,
      tag: `supplement-${supplement.toLowerCase()}`,
      data: {
        type: 'supplement',
        supplement,
        timing,
        timestamp: new Date().getTime(),
      },
      actions: [
        { action: 'taken', title: '✅ Tomado' },
        { action: 'snooze', title: '⏰ 15 min más' },
        { action: 'skip', title: '❌ Omitir' },
      ],
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
    });
  }

  /**
   * Notificación de nuevo reporte generado
   */
  async showNewReportNotification(reportType: string): Promise<boolean> {
    return this.showNotification({
      title: '📊 ¡Nuevo Reporte Listo!',
      body: `Tu reporte de ${reportType} ha sido generado exitosamente`,
      tag: 'new-report',
      data: { type: 'report', reportType },
      actions: [
        { action: 'view', title: '👁️ Ver Reporte' },
        { action: 'share', title: '📤 Compartir' },
      ],
      requireInteraction: true,
      image: '/fitness-1.webp',
    });
  }

  /**
   * Notificación de logro/streak
   */
  async showAchievementNotification(
    achievement: string,
    streak: number
  ): Promise<boolean> {
    return this.showNotification({
      title: `🎉 ¡Felicidades! ${achievement}`,
      body: `Llevas ${streak} días seguidos. ¡Sigue así!`,
      tag: 'achievement',
      data: { type: 'achievement', achievement, streak },
      actions: [
        { action: 'share', title: '📤 Compartir logro' },
        { action: 'continue', title: '💪 Continuar' },
      ],
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    });
  }

  /**
   * Configurar listener para mensajes del service worker
   */
  private setupServiceWorkerListener(): void {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.addEventListener('message', event => {
      console.log('💬 Mensaje recibido del SW:', event.data);

      const { type, supplement, notificationTag, notificationType, timestamp } =
        event.data || {};

      switch (type) {
        case 'SUPPLEMENT_TAKEN':
          console.log(`💊 Suplemento marcado como tomado: ${supplement}`);
          // Aquí podrías actualizar el estado de la aplicación
          // o disparar un evento personalizado
          window.dispatchEvent(
            new CustomEvent('supplementTaken', {
              detail: { supplement, timestamp },
            })
          );
          break;

        case 'NOTIFICATION_CLOSED':
          console.log(
            `❌ Notificación cerrada: ${notificationTag} (${notificationType})`
          );
          // Registrar analytics o actualizar estado
          window.dispatchEvent(
            new CustomEvent('notificationClosed', {
              detail: {
                tag: notificationTag,
                type: notificationType,
                timestamp,
              },
            })
          );
          break;

        default:
          console.log('🔄 Mensaje del SW no reconocido:', type);
      }
    });

    console.log('✅ Listener del service worker configurado');
  }

  /**
   * Limpiar notificaciones antiguas
   */
  async clearOldNotifications(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications();

      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

      notifications.forEach(notification => {
        const timestamp = notification.data?.timestamp || 0;
        if (timestamp < oneDayAgo) {
          notification.close();
        }
      });

      console.log('✅ Notificaciones antiguas limpiadas');
    } catch (error) {
      console.error('❌ Error limpiando notificaciones:', error);
    }
  }
}

// Exportar instancia singleton
export const notificationService = NotificationService.getInstance();
