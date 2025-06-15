import React, { useState } from 'react';
import { UserProfile } from '../types';
import { FaUser, FaRuler, FaDumbbell, FaHeartbeat } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { sportProfiles } from '../data/supplements';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

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

  // Estados locales string para los campos multi-valor
  const [medicalConditionsInput, setMedicalConditionsInput] = useState(profile.medicalConditions.join(', '));
  const [allergiesInput, setAllergiesInput] = useState(profile.allergies.join(', '));
  const [currentSupplementsInput, setCurrentSupplementsInput] = useState(profile.currentSupplements.join(', '));

  const genderOptions = [
    { value: 'male', label: t('Masculino') },
    { value: 'female', label: t('Femenino') },
    { value: 'other', label: t('Otro') },
  ];

  const experienceOptions = [
    { value: 'beginner', label: t('Principiante') },
    { value: 'intermediate', label: t('Intermedio') },
    { value: 'advanced', label: t('Avanzado') },
  ];

  const frequencyOptions = [
    { value: 'low', label: t('Baja (1-2 veces/semana)') },
    { value: 'medium', label: t('Media (3-4 veces/semana)') },
    { value: 'high', label: t('Alta (5+ veces/semana)') },
  ];

  const sportOptions = [
    { value: '', label: t('Selecciona un deporte') },
    ...sportProfiles.map(sport => ({ value: sport.name, label: t(sport.name) }))
  ];

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: '0.75rem',
      backgroundColor: state.isFocused ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
      borderColor: state.isFocused ? '#dc2626' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px #dc262633' : '0 1px 2px 0 rgba(0,0,0,0.04)',
      minHeight: '44px',
      fontSize: '1rem',
      color: '#111827',
      width: '100%',
      transition: 'all 0.2s',
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '0.75rem',
      zIndex: 50,
      width: '100%',
      fontSize: '1rem',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fee2e2' : '#fff',
      color: state.isSelected ? '#fff' : '#111827',
      fontWeight: state.isSelected ? 700 : 500,
      fontSize: '1rem',
      cursor: 'pointer',
    }),
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const nextStep = () => {
    // Antes de avanzar, sincroniza los campos multi-valor si estamos en el paso 3
    if (step === 3) {
      setProfile(prev => ({
        ...prev,
        medicalConditions: medicalConditionsInput.split(',').map(s => s.trim()).filter(Boolean),
        allergies: allergiesInput.split(',').map(s => s.trim()).filter(Boolean),
        currentSupplements: currentSupplementsInput.split(',').map(s => s.trim()).filter(Boolean),
      }));
    }
    // Validación por paso
    if (step === 0) {
      if (!profile.age || !profile.gender) {
        const missingFields = [];
        if (!profile.age) missingFields.push(t('Edad'));
        if (!profile.gender) missingFields.push(t('Género'));
        setError(t('Por favor, completa los siguientes campos obligatorios: ') + missingFields.join(', '));
        return;
      }
    }
    if (step === 1) {
      if (!profile.weight || !profile.height) {
        const missingFields = [];
        if (!profile.weight) missingFields.push(t('Peso'));
        if (!profile.height) missingFields.push(t('Altura'));
        setError(t('Por favor, completa los siguientes campos obligatorios: ') + missingFields.join(', '));
        return;
      }
    }
    if (step === 2) {
      if (!profile.experience || !profile.frequency || !profile.sport) {
        const missingFields = [];
        if (!profile.experience) missingFields.push(t('Nivel de experiencia'));
        if (!profile.frequency) missingFields.push(t('Frecuencia de entrenamiento'));
        if (!profile.sport) missingFields.push(t('Deporte principal'));
        setError(t('Por favor, completa los siguientes campos obligatorios: ') + missingFields.join(', '));
        return;
      }
    }
    // El último paso solo tiene campos opcionales
    setError(null);
    setStep(s => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sincroniza los campos multi-valor antes de enviar
    setProfile(prev => ({
      ...prev,
      medicalConditions: medicalConditionsInput.split(',').map(s => s.trim()).filter(Boolean),
      allergies: allergiesInput.split(',').map(s => s.trim()).filter(Boolean),
      currentSupplements: currentSupplementsInput.split(',').map(s => s.trim()).filter(Boolean),
    }));
    // Validación personalizada final
    if (!profile.age || !profile.gender || !profile.weight || !profile.height || !profile.experience || !profile.frequency || !profile.sport || !profile.objective) {
      const missingFields = [];
      if (!profile.age) missingFields.push(t('Edad'));
      if (!profile.gender) missingFields.push(t('Género'));
      if (!profile.weight) missingFields.push(t('Peso'));
      if (!profile.height) missingFields.push(t('Altura'));
      if (!profile.experience) missingFields.push(t('Nivel de experiencia'));
      if (!profile.frequency) missingFields.push(t('Frecuencia de entrenamiento'));
      if (!profile.sport) missingFields.push(t('Deporte principal'));
      if (!profile.objective) missingFields.push(t('Objetivo'));
      setError(t('Por favor, completa los siguientes campos obligatorios: ') + missingFields.join(', '));
      return;
    }
    onComplete(profile);
  };

  return (
    <div className={`max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-12 sm:py-8 px-4 sm:px-8 ${step === 2 ? 'mt-16' : step === 3 ? 'mt-8' : 'mt-24'}`}>
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
                <label className="block text-gray-600 mb-1">
                  {t('Edad')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition appearance-none"
                  style={{ MozAppearance: 'textfield' }}
                  value={profile.age === 0 ? '' : profile.age}
                  placeholder="0"
                  onChange={e => handleInputChange('age', e.target.value === '' ? 0 : parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  {t('Género')} <span className="text-red-500">*</span>
                </label>
                <Select
                  classNamePrefix="react-select"
                  options={genderOptions}
                  value={genderOptions.find(opt => opt.value === profile.gender)}
                  onChange={opt => handleInputChange('gender', opt?.value || '')}
                  isSearchable={false}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: '0.75rem',
                      backgroundColor: state.isFocused ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
                      borderColor: state.isFocused ? '#dc2626' : '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 2px #dc262633' : '0 1px 2px 0 rgba(0,0,0,0.04)',
                      minHeight: '44px',
                      fontSize: '1rem',
                      color: '#111827',
                      width: '100%',
                      transition: 'all 0.2s',
                    }),
                    menu: base => ({
                      ...base,
                      borderRadius: '0.75rem',
                      zIndex: 50,
                      width: '100%',
                      fontSize: '1rem',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fee2e2' : '#fff',
                      color: state.isSelected ? '#fff' : '#111827',
                      fontWeight: state.isSelected ? 700 : 500,
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }),
                  }}
                />
              </div>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">{t('Medidas Corporales')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  {t('Peso (kg)')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={profile.weight === 0 ? '' : profile.weight}
                  placeholder="0"
                  onChange={e => handleInputChange('weight', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  {t('Altura (cm)')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={profile.height === 0 ? '' : profile.height}
                  placeholder="0"
                  onChange={e => handleInputChange('height', e.target.value === '' ? 0 : parseInt(e.target.value))}
                />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <div className="-mt-1">
            <h2 className="text-xl font-bold text-red-700 mb-4">{t('Experiencia Deportiva')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  {t('Nivel de experiencia')} <span className="text-red-500">*</span>
                </label>
                <Select
                  classNamePrefix="react-select"
                  options={experienceOptions}
                  value={experienceOptions.find(opt => opt.value === profile.experience)}
                  onChange={opt => handleInputChange('experience', opt?.value || '')}
                  isSearchable={false}
                  styles={selectStyles}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">
                  {t('Frecuencia de entrenamiento')} <span className="text-red-500">*</span>
                </label>
                <Select
                  classNamePrefix="react-select"
                  options={frequencyOptions}
                  value={frequencyOptions.find(opt => opt.value === profile.frequency)}
                  onChange={opt => handleInputChange('frequency', opt?.value || '')}
                  isSearchable={false}
                  styles={selectStyles}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 mb-1">
                  {t('Deporte principal')} <span className="text-red-500">*</span>
                </label>
                <Select
                  classNamePrefix="react-select"
                  options={sportOptions}
                  value={sportOptions.find(opt => opt.value === profile.sport)}
                  onChange={opt => handleInputChange('sport', opt?.value || '')}
                  isSearchable={false}
                  styles={selectStyles}
                />
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-4">{t('Salud y Objetivos')}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">{t('Condiciones médicas')}</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={medicalConditionsInput}
                  placeholder={t('Ejemplo: Asma, Diabetes')}
                  onChange={e => setMedicalConditionsInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Alergias')}</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={allergiesInput}
                  placeholder={t('Ejemplo: Lactosa, Gluten')}
                  onChange={e => setAllergiesInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Objetivo')}</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={profile.objective}
                  placeholder={t('Ejemplo: Ganar masa muscular')}
                  onChange={e => handleInputChange('objective', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">{t('Suplementos actuales')}</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={currentSupplementsInput}
                  placeholder={t('Ejemplo: Proteína, Creatina')}
                  onChange={e => setCurrentSupplementsInput(e.target.value)}
                />
              </div>
            </div>
          </div>
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