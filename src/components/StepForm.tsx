import React, { useState } from 'react';
import { UserProfile } from '../types';
import { FaUser, FaRuler, FaDumbbell, FaHeartbeat } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { sportProfiles } from '../data/supplements';
import { useTranslation } from 'react-i18next';

interface StepFormProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
  isEditing?: boolean;
}

const steps: { label: string; icon: IconType }[] = [
  { label: 'Información Personal', icon: FaUser },
  { label: 'Medidas Corporales', icon: FaRuler },
  { label: 'Experiencia Deportiva', icon: FaDumbbell },
  { label: 'Salud y Objetivos', icon: FaHeartbeat },
];

const StepForm: React.FC<StepFormProps> = ({ onComplete, initialProfile, isEditing = false }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(() => initialProfile || {
    age: 0,
    gender: 'male',
    weight: 0,
    height: 0,
    objective: '',
    experience: 'beginner',
    frequency: 'low',
    sport: '',
    medicalConditions: [],
    allergies: [],
    currentSupplements: []
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación personalizada
    if (!profile.age) {
      setError(t('Por favor, introduce tu edad'));
      return;
    }
    if (!profile.gender) {
      setError(t('Por favor, selecciona tu género'));
      return;
    }
    if (!profile.weight) {
      setError(t('Por favor, introduce tu peso'));
      return;
    }
    if (!profile.height) {
      setError(t('Por favor, introduce tu altura'));
      return;
    }
    if (!profile.sport) {
      setError(t('Por favor, selecciona tu deporte principal'));
      return;
    }
    if (!profile.objective) {
      setError(t('Por favor, introduce tu objetivo'));
      return;
    }
    onComplete(profile);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-12 sm:py-8 px-4 sm:px-8">
      {/* Wizard Steps */}
      <div className="flex justify-between items-center mb-8 relative w-full">
        {steps.map((s, i) => {
          const Icon = s.icon as React.FC<{ size?: number }>;
          const isCompleted = i < step;
          const isActive = i === step;
          return (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`step-circle transition-colors duration-300 rounded-full mb-1 border-2
                    ${isCompleted ? 'bg-green-500 border-green-500 text-white'
                      : isActive ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-gray-200 border-gray-300 text-gray-500'}
                    w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl`}
                >
                  {Icon ? <Icon size={20} /> : null}
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold text-center break-words ${isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                  {t(s.label)}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`step-connector transition-all duration-500 h-1 flex-1 mx-0.5 sm:mx-2 rounded-full
                    ${isCompleted ? 'bg-green-500' : isActive ? 'bg-red-300' : 'bg-gray-200'}`}
                  style={{ minWidth: 8 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {error && (
        <div className="text-red-600 text-sm text-center mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 0 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">{t('Información Personal')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">{t('Edad')}</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  value={profile.age === 0 ? '' : profile.age}
                  placeholder="0"
                  onChange={e => handleInputChange('age', e.target.value === '' ? 0 : parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Género')}</label>
                <select
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  value={profile.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                >
                  <option value="male">{t('Masculino')}</option>
                  <option value="female">{t('Femenino')}</option>
                  <option value="other">{t('Otro')}</option>
                </select>
              </div>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">{t('Medidas Corporales')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">{t('Peso (kg)')}</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  value={profile.weight === 0 ? '' : profile.weight}
                  placeholder="0"
                  onChange={e => handleInputChange('weight', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Altura (cm)')}</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  value={profile.height === 0 ? '' : profile.height}
                  placeholder="0"
                  onChange={e => handleInputChange('height', e.target.value === '' ? 0 : parseInt(e.target.value))}
                />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">{t('Experiencia Deportiva')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">{t('Nivel de experiencia')}</label>
                <select
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  value={profile.experience}
                  onChange={e => handleInputChange('experience', e.target.value)}
                >
                  <option value="beginner">{t('Principiante')}</option>
                  <option value="intermediate">{t('Intermedio')}</option>
                  <option value="advanced">{t('Avanzado')}</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Frecuencia de entrenamiento')}</label>
                <select
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  value={profile.frequency}
                  onChange={e => handleInputChange('frequency', e.target.value)}
                >
                  <option value="low">{t('Baja (1-2 veces/semana)')}</option>
                  <option value="medium">{t('Media (3-4 veces/semana)')}</option>
                  <option value="high">{t('Alta (5+ veces/semana)')}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 mb-1">{t('Deporte principal')}</label>
                <select
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  value={profile.sport || ''}
                  onChange={e => handleInputChange('sport', e.target.value)}
                >
                  <option value="">{t('Selecciona un deporte')}</option>
                  {sportProfiles.map((sport) => (
                    <option key={sport.name} value={sport.name}>{t(sport.name)}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">{t('Salud y Objetivos')}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">{t('Condiciones médicas')}</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  value={profile.medicalConditions.join(', ')}
                  placeholder={t('Ejemplo: Asma, Diabetes')}
                  onChange={e => handleInputChange('medicalConditions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Alergias')}</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  value={profile.allergies.join(', ')}
                  placeholder={t('Ejemplo: Lactosa, Gluten')}
                  onChange={e => handleInputChange('allergies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Objetivo')}</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  value={profile.objective}
                  placeholder={t('Ejemplo: Ganar masa muscular')}
                  onChange={e => handleInputChange('objective', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Suplementos actuales')}</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  value={profile.currentSupplements.join(', ')}
                  placeholder={t('Ejemplo: Proteína, Creatina')}
                  onChange={e => handleInputChange('currentSupplements', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
            </div>
          </>
        )}
        <div className="flex justify-between mt-8">
          {step > 0 && (
            <button
              type="button"
              className="bg-white border border-red-600 text-red-600 font-bold px-6 py-2 rounded-xl shadow hover:bg-red-50"
              onClick={prevStep}
            >
              ← {t('Anterior')}
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-xl shadow"
              onClick={nextStep}
            >
              {t('Siguiente')} →
            </button>
          )}
          {step === steps.length - 1 && (
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-2 rounded-xl shadow"
            >
              {isEditing ? t('Actualizar perfil') : t('Finalizar')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StepForm; 