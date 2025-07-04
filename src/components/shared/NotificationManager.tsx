import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { UserProfile } from '../../types';

interface NotificationManagerProps {
  userProfile?: UserProfile | null;
  user?: any;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  userProfile,
  user,
}) => {
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>('default');
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Verificar estado de permisos al cargar
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // Inicializar servicio de notificaciones
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    const initialized = await notificationService.initialize();
    if (initialized && notificationService.hasPermission()) {
      const token = await notificationService.getDeviceToken();
      setDeviceToken(token);
    }
  };

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();

    if (granted) {
      setPermissionStatus('granted');

      // Obtener token del dispositivo
      const token = await notificationService.getDeviceToken();
      setDeviceToken(token);

      // Mostrar notificación de bienvenida
      await notificationService.showNotification({
        title: '🎉 ¡Notificaciones Activadas!',
        body: 'Ahora recibirás recordatorios de tus suplementos',
        tag: 'welcome-notification',
        data: { type: 'welcome' },
        requireInteraction: true,
      });

      // Si el usuario tiene perfil, generar notificaciones personalizadas
      if (userProfile) {
        await generatePersonalizedReminders();
      }
    } else {
      setPermissionStatus('denied');
    }
  };

  const generatePersonalizedReminders = async () => {
    if (!userProfile) return;

    // Generar notificaciones basadas en el perfil
    const notifications =
      notificationService.generateUserNotifications(userProfile);

    console.log(
      '🔔 Notificaciones personalizadas generadas:',
      notifications.length
    );

    // Mostrar ejemplo de recordatorio de suplemento si tiene alguno
    if (userProfile.currentSupplements.length > 0) {
      setTimeout(async () => {
        await notificationService.showSupplementReminder(
          userProfile.currentSupplements[0],
          'morning'
        );
      }, 5000); // Mostrar después de 5 segundos como demo
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return '✅ Activadas';
      case 'denied':
        return '❌ Bloqueadas';
      default:
        return '⚡ No configuradas';
    }
  };

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'text-green-600 dark:text-green-400';
      case 'denied':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  if (!user) {
    return null; // No mostrar si el usuario no está logueado
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>🔔</span>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Notificaciones Push
            </h3>
            <p className={`text-sm ${getPermissionStatusColor()}`}>
              {getPermissionStatusText()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          data-testid='settings-button'
          aria-label='Configuración de notificaciones'
        >
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>

      {showSettings && (
        <div className='space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
          {permissionStatus === 'default' && (
            <div className='bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
              <p className='text-sm text-blue-800 dark:text-blue-200 mb-3'>
                Activa las notificaciones para recibir recordatorios de tus
                suplementos y actualizaciones importantes.
              </p>
              <button
                onClick={requestPermission}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
              >
                🔔 Activar Notificaciones
              </button>
            </div>
          )}

          {permissionStatus === 'denied' && (
            <div className='bg-red-50 dark:bg-red-900/20 p-3 rounded-lg'>
              <p className='text-sm text-red-800 dark:text-red-200 mb-2'>
                Las notificaciones están bloqueadas. Para activarlas:
              </p>
              <ul className='text-xs text-red-700 dark:text-red-300 space-y-1'>
                <li>• Haz clic en el candado 🔒 en la barra de direcciones</li>
                <li>• Permite las notificaciones</li>
                <li>• Recarga la página</li>
              </ul>
            </div>
          )}

          {permissionStatus === 'granted' && (
            <div className='space-y-3'>
              <div className='bg-green-50 dark:bg-green-900/20 p-3 rounded-lg'>
                <p className='text-sm text-green-800 dark:text-green-200'>
                  ✅ Las notificaciones están activas. Recibirás recordatorios
                  personalizados.
                </p>
              </div>

              {userProfile && userProfile.currentSupplements.length > 0 && (
                <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
                  <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>
                    📋 Recordatorios configurados para:
                  </p>
                  <ul className='text-xs text-gray-600 dark:text-gray-400'>
                    {userProfile.currentSupplements
                      .slice(0, 3)
                      .map((supplement, index) => (
                        <li key={index}>• {supplement}</li>
                      ))}
                    {userProfile.currentSupplements.length > 3 && (
                      <li>
                        • Y {userProfile.currentSupplements.length - 3} más...
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {deviceToken && (
                <details className='text-xs text-gray-500 dark:text-gray-400'>
                  <summary className='cursor-pointer'>
                    Información técnica
                  </summary>
                  <p className='mt-2 font-mono break-all bg-gray-100 dark:bg-gray-800 p-2 rounded'>
                    Token: {deviceToken.substring(0, 20)}...
                  </p>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationManager;
