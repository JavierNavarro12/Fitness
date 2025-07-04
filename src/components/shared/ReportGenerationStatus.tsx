import React from 'react';
import { ReportGenerationState } from '../../types';
import Loader from './Loader';

interface ReportGenerationStatusProps {
  state: ReportGenerationState;
  onRetry?: () => void;
  onCancel?: () => void;
}

const ReportGenerationStatus: React.FC<ReportGenerationStatusProps> = ({
  state,
  onRetry,
  onCancel,
}) => {
  const renderStatus = () => {
    switch (state.status) {
      case 'generating':
        return (
          <div className='flex flex-col items-center py-8'>
            <Loader />
            <p className='text-lg font-medium text-gray-900 dark:text-gray-100 mt-4'>
              {state.message}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              Esto puede tomar unos momentos...
            </p>
          </div>
        );

      case 'retrying':
        return (
          <div className='flex flex-col items-center py-8'>
            <div className='relative'>
              <Loader />
              <div className='absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>
                  {state.attempt}
                </span>
              </div>
            </div>
            <p className='text-lg font-medium text-yellow-600 dark:text-yellow-400 mt-4'>
              {state.message}
            </p>
            <div className='flex items-center mt-2'>
              <div className='flex space-x-1'>
                {Array.from({ length: state.maxRetries || 3 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < (state.attempt || 0)
                        ? 'bg-yellow-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className='text-sm text-gray-500 dark:text-gray-400 ml-2'>
                Intento {state.attempt}/{state.maxRetries}
              </span>
            </div>
          </div>
        );

      case 'fallback':
        return (
          <div className='flex flex-col items-center py-8'>
            <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-8 h-8 text-blue-600 dark:text-blue-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <p className='text-lg font-medium text-blue-600 dark:text-blue-400 mb-2'>
              {state.message}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400 text-center max-w-md'>
              Tu reporte está listo con recomendaciones estándar basadas en tu
              perfil. Aunque no pudimos conectar con la IA, las recomendaciones
              siguen siendo efectivas.
            </p>
          </div>
        );

      case 'error':
        return (
          <div className='flex flex-col items-center py-8'>
            <div className='w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-8 h-8 text-red-600 dark:text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <p className='text-lg font-medium text-red-600 dark:text-red-400 mb-2'>
              {state.message}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-6'>
              No pudimos generar tu reporte en este momento. Puedes intentar de
              nuevo o usar nuestras recomendaciones básicas.
            </p>
            <div className='flex space-x-3'>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className='px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors'
                >
                  Reintentar
                </button>
              )}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className='px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        );

      case 'success':
        return (
          <div className='flex flex-col items-center py-8'>
            <div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-8 h-8 text-green-600 dark:text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <p className='text-lg font-medium text-green-600 dark:text-green-400 mb-2'>
              ¡Reporte generado exitosamente!
            </p>
            {state.source === 'fallback' && (
              <p className='text-sm text-blue-600 dark:text-blue-400 mb-4'>
                Generado con recomendaciones estándar
              </p>
            )}
            {state.source === 'ai' && (
              <p className='text-sm text-green-600 dark:text-green-400 mb-4'>
                Reporte personalizado con IA
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (state.status === 'idle') {
    return null;
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mx-auto max-w-md'>
      {renderStatus()}
    </div>
  );
};

export default ReportGenerationStatus;
