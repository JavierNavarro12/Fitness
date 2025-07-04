import React, { useState, useEffect } from 'react';

interface UpdateNotificationProps {
  onUpdate?: () => void;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  onUpdate,
}) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check para entorno de testing con try-catch
    try {
      if (
        typeof navigator !== 'undefined' &&
        'serviceWorker' in navigator &&
        navigator.serviceWorker.ready
      ) {
        navigator.serviceWorker.ready
          .then(reg => {
            setRegistration(reg);

            // Escuchar por updates del service worker
            if (reg && reg.addEventListener) {
              reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (newWorker && newWorker.addEventListener) {
                  newWorker.addEventListener('statechange', () => {
                    if (
                      newWorker.state === 'installed' &&
                      navigator.serviceWorker.controller
                    ) {
                      setShowUpdate(true);
                    }
                  });
                }
              });
            }

            // Verificar si ya hay un worker esperando
            if (reg && reg.waiting) {
              setShowUpdate(true);
            }
          })
          .catch(() => {
            // Silenciar errores en testing
          });

        // También escuchar el evento desde el service worker
        if (
          navigator.serviceWorker &&
          navigator.serviceWorker.addEventListener
        ) {
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
              setShowUpdate(true);
            }
          });
        }
      }
    } catch (e) {
      // Silenciar errores en entorno de testing
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Enviar mensaje al service worker para que tome control
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Escuchar cuando el nuevo SW tome control (solo en browser)
      if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          onUpdate?.();
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        });
      }
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);

    // No mostrar de nuevo por 24 horas (con check para testing)
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('egn-update-dismissed', Date.now().toString());
      }
    } catch (e) {
      // Silenciar errores en testing
    }
  };

  // Revisar si fue descartada recientemente (con check para testing)
  try {
    if (typeof localStorage !== 'undefined') {
      const dismissedTime = localStorage.getItem('egn-update-dismissed');
      if (dismissedTime) {
        const hoursSinceDismissed =
          (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
        if (hoursSinceDismissed < 24) return null;
      }
    }
  } catch (e) {
    // Silenciar errores en testing
  }

  if (!showUpdate) return null;

  return (
    <div className='fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-2xl animate-slide-down max-w-sm w-full mx-4'>
      <div className='flex items-start space-x-3'>
        <div className='flex-shrink-0 mt-1'>
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <div className='flex-1 min-w-0'>
          <h4 className='text-sm font-bold mb-1'>Nueva versión disponible</h4>
          <p className='text-xs text-blue-100 mb-3'>
            Hemos mejorado EGN Fitness con nuevas funciones y correcciones.
          </p>
          <div className='flex space-x-2'>
            <button
              onClick={handleUpdate}
              className='px-3 py-1 bg-white text-blue-600 text-xs font-semibold rounded hover:bg-blue-50 transition-colors'
            >
              Actualizar
            </button>
            <button
              onClick={handleDismiss}
              className='px-3 py-1 text-xs font-medium text-blue-100 hover:text-white transition-colors'
            >
              Más tarde
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className='flex-shrink-0 text-blue-200 hover:text-white p-1'
          aria-label='Cerrar'
        >
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;
