import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  onInstall,
  onDismiss,
}) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Detectar si ya está instalada (con check para testing)
    let isStandalone = false;
    let isInWebApp = false;

    // Check más robusto para matchMedia
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        isStandalone =
          mediaQuery && typeof mediaQuery.matches === 'boolean'
            ? mediaQuery.matches
            : false;
      }
    } catch (e) {
      // Silenciar error en entorno de testing
      isStandalone = false;
    }

    try {
      if (typeof window !== 'undefined' && window.navigator) {
        isInWebApp = (window.navigator as any).standalone === true;
      }
    } catch (e) {
      // Silenciar error en entorno de testing
      isInWebApp = false;
    }

    setIsInstalled(isStandalone || isInWebApp);

    // Listener para el evento beforeinstallprompt (solo en browser)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Mostrar prompt después de un delay para mejor UX
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listener para cuando la app se instala
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      onInstall?.();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt
        );
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, [onInstall]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        onInstall?.();
      }

      setShowPrompt(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error al mostrar prompt de instalación:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();

    // No mostrar de nuevo por 7 días
    localStorage.setItem('egn-install-dismissed', Date.now().toString());
  };

  // No mostrar si ya está instalada
  if (isInstalled) return null;

  // Revisar si fue descartada recientemente
  const dismissedTime = localStorage.getItem('egn-install-dismissed');
  if (dismissedTime) {
    const daysSinceDismissed =
      (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) return null;
  }

  // Prompt para iOS
  if (isIOS && showPrompt) {
    return (
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 animate-slide-up'>
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <img
              src='/logo-192.png'
              alt='EGN'
              className='w-12 h-12 rounded-lg'
            />
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Instalar EGN Fitness
            </h3>
            <p className='text-sm text-gray-600 mt-1'>
              Agrega EGN a tu pantalla de inicio para acceso rápido y una mejor
              experiencia.
            </p>
            <div className='mt-3 flex items-center space-x-2 text-sm text-gray-500'>
              <span className='inline-flex items-center'>
                <svg
                  className='w-4 h-4 mr-1'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                Toca
              </span>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              <span>luego "Agregar a pantalla de inicio"</span>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className='flex-shrink-0 text-gray-400 hover:text-gray-600 p-1'
            aria-label='Cerrar'
          >
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
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
  }

  // Prompt para Android/otros navegadores
  if (showPrompt && deferredPrompt) {
    return (
      <div className='fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 shadow-lg z-50 animate-slide-up'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='flex-shrink-0'>
              <img
                src='/logo-192.png'
                alt='EGN'
                className='w-10 h-10 rounded-lg'
              />
            </div>
            <div className='flex-1'>
              <h3 className='font-semibold text-sm'>Instalar EGN Fitness</h3>
              <p className='text-xs text-red-100 mt-1'>
                Acceso rápido, notificaciones y mejor experiencia
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={handleDismiss}
              className='px-3 py-1 text-xs font-medium text-red-100 hover:text-white transition-colors'
            >
              Ahora no
            </button>
            <button
              onClick={handleInstallClick}
              className='px-4 py-2 bg-white text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors'
            >
              Instalar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
