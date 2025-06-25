import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../../types';

interface ProfileSummaryProps {
  user: any;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onClose?: () => void;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ user, userProfile, onLogout, onClose }) => {
  const { t } = useTranslation();

  const mapGender = (g: string) => {
    if (!g) return '';
    const key1 = `profile.gender.${g}`;
    const key2 = `gender.${g}`;
    const translation = t(key1);
    if (translation === key1) {
      const fallback = t(key2);
      return fallback === key2 ? g.charAt(0).toUpperCase() + g.slice(1) : fallback;
    }
    return translation;
  };
  const mapExperience = (e: string) => {
    if (!e) return '';
    const key1 = `profile.experience.${e}`;
    const key2 = `experience.${e}`;
    const translation = t(key1);
    if (translation === key1) {
      const fallback = t(key2);
      return fallback === key2 ? e.charAt(0).toUpperCase() + e.slice(1) : fallback;
    }
    return translation;
  };
  const mapFrequency = (f: string) => {
    if (!f) return '';
    const key1 = `profile.frequency.${f}`;
    const key2 = `frequency.${f}`;
    const translation = t(key1);
    if (translation === key1) {
      const fallback = t(key2);
      return fallback === key2 ? f.charAt(0).toUpperCase() + f.slice(1) : fallback;
    }
    return translation;
  };

  const avatarUrl = userProfile?.photo || user?.photoURL;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative animate-fade-in">
      {onClose && (
        <button
          className="absolute -top-2 right-0 text-gray-300 hover:text-red-600 text-4xl font-bold z-10 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full transition-all"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
      )}
      <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-6 text-center">{t('profileSummary.title')}</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center mb-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-4xl">{user?.displayName?.[0]?.toUpperCase() || '👤'}</span>
          )}
        </div>
        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{user?.displayName || user?.email?.split('@')[0]}</span>
        <span className="text-gray-500 dark:text-gray-300 text-sm">{user?.email}</span>
      </div>
      {userProfile && (
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p><strong>{t('profile.age')}:</strong> {userProfile.age}</p>
          <p><strong>{t('profile.gender')}:</strong> {mapGender(userProfile.gender)}</p>
          <p><strong>{t('profile.weight')}:</strong> {userProfile.weight} kg</p>
          <p><strong>{t('profile.height')}:</strong> {userProfile.height} cm</p>
          <p><strong>{t('profile.objective')}:</strong> {userProfile.objective}</p>
          <p><strong>{t('profile.experience')}:</strong> {mapExperience(userProfile.experience)}</p>
          <p><strong>{t('profile.trainingFrequency')}:</strong> {mapFrequency(userProfile.frequency)}</p>
          <p><strong>{t('profile.mainSport')}:</strong> {t(userProfile.sport)}</p>
          <p className="md:col-span-2"><strong>{t('profile.medicalConditions')}:</strong> {userProfile.medicalConditions?.join(', ') || t('profile.none')}</p>
          <p className="md:col-span-2"><strong>{t('profile.allergies')}:</strong> {userProfile.allergies?.join(', ') || t('profile.none')}</p>
          <p className="md:col-span-2"><strong>{t('profile.currentSupplements')}:</strong> {userProfile.currentSupplements?.join(', ') || t('profile.none')}</p>
        </div>
      )}
      <button
        onClick={onLogout}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors mt-8"
      >
        {t('userDropdown.logout')}
      </button>
    </div>
  );
};

export default ProfileSummary; 