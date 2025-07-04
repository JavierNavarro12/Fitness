import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../types';
import {
  getUserFavorites,
  removeFromFavorites,
} from '../../services/favoritesService';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase';
import NotificationManager from '../shared/NotificationManager';

interface ProfileSummaryProps {
  user: any;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onClose?: () => void;
  reports?: any[];
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  user,
  userProfile,
  onLogout,
  onClose,
  reports = [],
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favoriteReportIds, setFavoriteReportIds] = useState<Set<string>>(
    new Set()
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const avatarUrl = userProfile?.photo || user?.photoURL;
  const displayName =
    user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  const fullEmail = user?.email || '';

  // Escuchar cambios en el estado de autenticación y cargar favoritos
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      setCurrentUser(authUser);
      if (authUser) {
        loadUserFavorites(authUser.uid);
      } else {
        setFavoriteReportIds(new Set());
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Cargar favoritos del usuario desde Firebase
  const loadUserFavorites = async (uid: string) => {
    try {
      // Cargar favoritos desde Firebase
      const favorites = await getUserFavorites(uid);
      setFavoriteReportIds(new Set(favorites));
    } catch (error) {
      console.error('Error loading user favorites:', error);
    }
  };

  // Obtener los reportes favoritos reales
  const favoriteReports = reports
    .filter(report => favoriteReportIds.has(report.id))
    .map(report => {
      // Construir título más descriptivo con el deporte
      const baseTitleKey = 'report.title';
      const baseTitle = t(baseTitleKey);
      let enhancedTitle = baseTitle;

      // Si el reporte tiene información de perfil con deporte, agregarlo
      if (report.profile?.sport) {
        const sportTranslated = t(report.profile.sport);
        enhancedTitle = `${baseTitle} - ${sportTranslated}`;
      }

      return {
        id: report.id,
        title: enhancedTitle,
        date: new Date(report.createdAt).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
    })
    .slice(0, 5); // Limitar a 5 favoritos

  const handleReportClick = (reportId: string) => {
    // Cerrar el perfil si es un modal
    if (onClose) {
      onClose();
    }

    // Navegar a informes con el informe específico expandido
    navigate('/reports', { state: { expandId: reportId } });
  };

  const toggleFavorite = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se ejecute handleReportClick

    if (!currentUser) {
      console.warn('Usuario no autenticado');
      return;
    }

    try {
      const newFavorites = new Set(favoriteReportIds);
      newFavorites.delete(reportId); // Solo quitar de favoritos

      const success = await removeFromFavorites(currentUser.uid, reportId);

      if (success) {
        setFavoriteReportIds(newFavorites);
      } else {
        console.error('Error removing from favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <>
      {/* Mobile Design (sm and below) */}
      <div className='sm:hidden fixed inset-0 bg-gray-50 dark:bg-gray-900 overflow-y-auto'>
        {/* Close button (if needed) positioned absolutely */}
        {onClose && (
          <button
            onClick={onClose}
            className='absolute top-4 left-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10'
            aria-label={t('profileSummary.back')}
          >
            <svg
              className='w-6 h-6 text-gray-600 dark:text-gray-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
        )}

        <div className='px-6 pt-8 pb-24'>
          {/* Avatar and User Info */}
          <div className='flex flex-col items-center mb-8'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 p-1 mb-4'>
              <div className='w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden'>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt='avatar'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-900 flex items-center justify-center'>
                    <span className='text-teal-600 dark:text-teal-300 text-2xl font-semibold'>
                      {displayName[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>
              {displayName}
            </h2>
            <p className='text-blue-500 dark:text-blue-400 text-base mb-1'>
              {fullEmail}
            </p>
            {userProfile?.age && (
              <p className='text-blue-500 dark:text-blue-400 text-base'>
                {userProfile.age} {t('profileSummary.years')}
              </p>
            )}
          </div>

          {/* Metrics Cards */}
          {userProfile && (
            <div className='space-y-4 mb-8'>
              {/* Height and Weight */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 text-center'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>
                    {userProfile.height}cm
                  </div>
                  <div className='text-blue-500 dark:text-blue-400 text-sm'>
                    {t('profileSummary.height')}
                  </div>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 text-center'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>
                    {userProfile.weight}kg
                  </div>
                  <div className='text-blue-500 dark:text-blue-400 text-sm'>
                    {t('profileSummary.weight')}
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 text-center'>
                <div className='text-xl font-bold text-gray-900 dark:text-white mb-1'>
                  {userProfile.objective}
                </div>
                <div className='text-blue-500 dark:text-blue-400 text-sm'>
                  {t('profileSummary.objective')}
                </div>
              </div>
            </div>
          )}

          {/* Favorite Reports Section */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
              {t('profileSummary.favoriteReports')}
            </h3>
            <div className='space-y-3'>
              {favoriteReports.length > 0 ? (
                favoriteReports.map((report, index) => (
                  <div
                    key={index}
                    onClick={() => handleReportClick(report.id)}
                    className='w-full bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                  >
                    <button
                      onClick={async e => await toggleFavorite(report.id, e)}
                      className='w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                      aria-label={t('profileSummary.removeFavorite')}
                    >
                      <svg
                        className='w-5 h-5 text-yellow-500 hover:text-yellow-600 transition-colors'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
                      </svg>
                    </button>
                    <div className='flex-1 text-left'>
                      <div className='font-medium text-gray-900 dark:text-white'>
                        {report.title}
                      </div>
                      <div className='text-sm text-blue-500 dark:text-blue-400'>
                        {report.date}
                      </div>
                    </div>
                    <div className='ml-2'>
                      <svg
                        className='w-5 h-5 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center'>
                  <svg
                    className='w-12 h-12 text-gray-400 mx-auto mb-3'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                    />
                  </svg>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    {t('profileSummary.noFavorites')}
                  </p>
                  <p className='text-gray-400 dark:text-gray-500 text-xs mt-1'>
                    {t('profileSummary.addFavoritesHelp')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-2xl transition-colors duration-200'
          >
            {t('userDropdown.logout')}
          </button>
        </div>
      </div>

      {/* Desktop Design (sm and above) - Original Design */}
      <div className='hidden sm:block w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative animate-fade-in'>
        {onClose && (
          <button
            className='absolute -top-2 right-0 text-gray-300 hover:text-red-600 text-4xl font-bold z-10 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full transition-all'
            onClick={onClose}
            aria-label={t('profileSummary.close')}
          >
            ×
          </button>
        )}
        <h2 className='text-2xl font-bold text-red-700 dark:text-red-300 mb-6 text-center'>
          {t('profileSummary.title')}
        </h2>
        <div className='flex flex-col items-center mb-6'>
          <div className='w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center mb-2'>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt='avatar'
                className='w-full h-full object-cover'
              />
            ) : (
              <span className='text-gray-400 text-4xl'>
                {displayName[0]?.toUpperCase() || '👤'}
              </span>
            )}
          </div>
          <span className='font-semibold text-lg text-gray-800 dark:text-gray-100'>
            {displayName}
          </span>
          <span className='text-gray-500 dark:text-gray-300 text-sm'>
            {fullEmail}
          </span>
        </div>
        {userProfile && (
          <div className='text-sm text-gray-500 dark:text-gray-400 space-y-1'>
            <p>
              <strong>{t('profileSummary.age')}:</strong> {userProfile.age}{' '}
              {t('profileSummary.years')}
            </p>
            <p>
              <strong>{t('profileSummary.gender')}:</strong>{' '}
              {t('gender.' + userProfile.gender)}
            </p>
            <p>
              <strong>{t('profileSummary.weight')}:</strong>{' '}
              {userProfile.weight} {t('profileSummary.kg')}
            </p>
            <p>
              <strong>{t('profileSummary.height')}:</strong>{' '}
              {userProfile.height} cm
            </p>
            <p>
              <strong>{t('profileSummary.objective')}:</strong>{' '}
              {userProfile.objective}
            </p>
            <p>
              <strong>{t('profileSummary.experience')}:</strong>{' '}
              {t('experience.' + userProfile.experience)}
            </p>
            <p>
              <strong>{t('profileSummary.trainingFrequency')}:</strong>{' '}
              {t('frequency.' + userProfile.frequency)}
            </p>
            <p>
              <strong>{t('profileSummary.mainSport')}:</strong>{' '}
              {t(userProfile.sport)}
            </p>
            <p>
              <strong>{t('profileSummary.medicalConditions')}:</strong>{' '}
              {userProfile.medicalConditions?.length
                ? userProfile.medicalConditions.join(', ')
                : t('profileSummary.none')}
            </p>
            <p>
              <strong>{t('profileSummary.allergies')}:</strong>{' '}
              {userProfile.allergies?.length
                ? userProfile.allergies.join(', ')
                : t('profileSummary.none')}
            </p>
            <p>
              <strong>{t('profileSummary.currentSupplements')}:</strong>{' '}
              {userProfile.currentSupplements?.length
                ? userProfile.currentSupplements.join(', ')
                : t('profileSummary.none')}
            </p>
          </div>
        )}
        <button
          onClick={onLogout}
          className='w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors mt-8'
        >
          {t('userDropdown.logout')}
        </button>
      </div>

      <div className='fixed top-6 right-6 z-30'>
        <button
          onClick={() => setShowNotificationsModal(true)}
          className='p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none border border-gray-200 dark:border-gray-700'
          aria-label='Notificaciones'
          style={{ position: 'fixed', top: 24, right: 24 }}
        >
          <svg
            className='w-7 h-7 text-gray-500 dark:text-gray-300'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
            />
          </svg>
        </button>
      </div>

      {showNotificationsModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'
          onClick={() => setShowNotificationsModal(false)}
        >
          <div
            className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in'
            onClick={e => e.stopPropagation()}
          >
            <button
              className='absolute top-2 right-2 text-gray-400 hover:text-red-600 text-2xl font-bold p-1 focus:outline-none'
              onClick={() => setShowNotificationsModal(false)}
              aria-label='Cerrar'
            >
              ×
            </button>
            <NotificationManager userProfile={userProfile} user={user} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSummary;
