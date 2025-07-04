import React, { useState, useEffect } from 'react';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(() => {
    // Check para entorno de testing
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 animate-slide-down ${
        isOnline ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'
      }`}
    >
      <div className='flex items-center space-x-2'>
        <div className='flex-shrink-0'>
          {isOnline ? (
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          ) : (
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium'>
            {isOnline ? 'Conexión restablecida' : 'Modo offline'}
          </p>
          <p className='text-xs opacity-90'>
            {isOnline
              ? 'Todas las funciones disponibles'
              : 'Contenido limitado, pero disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
