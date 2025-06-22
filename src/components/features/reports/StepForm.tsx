import React, { useState } from 'react';
import { UserProfile } from '../../../types';
import { FaUser, FaRuler, FaDumbbell, FaHeartbeat } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { sportProfiles } from '../../../data/formData';
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
    gender: '',
    weight: 0,
    height: 0,
    objective: '',
    experience: '',
    frequency: '',
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
    ...sportProfiles.map((sport: { name: string }) => ({ value: sport.name, label: t(sport.name) })),
    { value: 'spacer1', label: ' ' },
    { value: 'spacer2', label: ' ' },
    { value: 'spacer3', label: ' ' },
    { value: 'spacer4', label: ' ' },
    { value: 'spacer5', label: ' ' },
    { value: 'spacer6', label: ' ' },
    { value: 'spacer7', label: ' ' },
    { value: 'spacer8', label: ' ' },
    
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
      maxHeight: 200,
      overflowY: 'auto',
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
    setProfile((prev: UserProfile) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const nextStep = () => {
    // Antes de avanzar, sincroniza los campos multi-valor si estamos en el paso 3
    if (step === 3) {
      setProfile((prev: UserProfile) => ({
        ...prev,
        medicalConditions: medicalConditionsInput.split(',').map((s: string) => s.trim()).filter(Boolean) as string[],
        allergies: allergiesInput.split(',').map((s: string) => s.trim()).filter(Boolean) as string[],
        currentSupplements: currentSupplementsInput.split(',').map((s: string) => s.trim()).filter(Boolean) as string[],
      }));
    }
    // Validación por paso
    if (step === 0) {
      if (!profile.age || !profile.gender) {
        const missingFields: string[] = [];
        if (!profile.age) missingFields.push(t('Edad'));
        if (!profile.gender) missingFields.push(t('Género'));
        setError(t('Por favor, completa los siguientes campos obligatorios: ') + missingFields.join(', '));
        return;
      }
      if (profile.age < 14 || profile.age > 99) {
        setError(t('Por favor, introduce una edad válida (entre 14 y 99 años).'));
        return;
      }
    }
    if (step === 1) {
      if (!profile.weight || !profile.height) {
        const missingFields: string[] = [];
        if (!profile.weight) missingFields.push(t('Peso'));
        if (!profile.height) missingFields.push(t('Altura'));
        setError(t('Por favor, completa los siguientes campos obligatorios: ') + missingFields.join(', '));
        return;
      }
      if (profile.weight < 30 || profile.weight > 300) {
        setError(t('Por favor, introduce un peso válido (entre 30 y 300 kg).'));
        return;
      }
      if (profile.height < 100 || profile.height > 250) {
        setError(t('Por favor, introduce una altura válida (entre 100 y 250 cm).'));
        return;
      }
    }
    if (step === 2) {
      if (!profile.experience || !profile.frequency || !profile.sport) {
        const missingFields: string[] = [];
        if (!profile.experience) missingFields.push(t('Nivel de experiencia'));
        if (!profile.frequency) missingFields.push(t('Frecuencia de entrenamiento'));
        if (!profile.sport) missingFields.push(t('Deporte principal'));
        setError(t('Por favor, completa los siguientes campos obligatorios: ') + missingFields.join(', '));
        return;
      }
    }
    // El último paso se valida en handleSubmit
    setError(null);
    setStep(s => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setError(null);
    setStep(s => Math.max(s - 1, 0));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sincroniza los campos multi-valor antes de enviar
    const finalProfile = {
      ...profile,
      medicalConditions: medicalConditionsInput.split(',').map((s: string) => s.trim()).filter(Boolean),
      allergies: allergiesInput.split(',').map((s: string) => s.trim()).filter(Boolean),
      currentSupplements: currentSupplementsInput.split(',').map((s: string) => s.trim()).filter(Boolean),
    };

    // Validación final solo para el campo 'objetivo' del último paso
    if (!finalProfile.objective) {
      setError(t('Por favor, completa el campo obligatorio: Objetivo'));
      return;
    }

    // Validación de rangos (ya se hizo por pasos, pero una comprobación final no hace daño)
    if (finalProfile.age < 14 || finalProfile.age > 99) {
      setError(t('Por favor, introduce una edad válida (entre 14 y 99 años).'));
      setStep(0);
      return;
    }
    if (finalProfile.weight < 30 || finalProfile.weight > 300) {
      setError(t('Por favor, introduce un peso válido (entre 30 y 300 kg).'));
      setStep(1);
      return;
    }
    if (finalProfile.height < 100 || finalProfile.height > 250) {
      setError(t('Por favor, introduce una altura válida (entre 100 y 250 cm).'));
      setStep(1);
      return;
    }

    onComplete(finalProfile);
  };

  return (
    <div className={`max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-16 px-12 flex flex-col min-h-[550px] ${step === 2 ? 'mt-2' : step === 3 ? 'mt-0' : 'mt-4'}`}>
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
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-center">
        {/* Este div agrupa el contenido del paso para empujar los botones hacia abajo */}
        <div>
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold text-red-700 mb-4">{t('Información Personal')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age-input" className="block text-gray-600 mb-1">
                    {t('Edad')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="age-input"
                    type="number"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition appearance-none"
                    style={{ MozAppearance: 'textfield' }}
                    value={profile.age === 0 ? '' : profile.age}
                    placeholder="0"
                    onChange={e => handleInputChange('age', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    aria-label={t('Edad')}
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
                    onChange={opt => handleInputChange('gender', opt?.value)}
                    styles={selectStyles}
                    placeholder={t('Selecciona...')}
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
                  <label htmlFor="weight-input" className="block text-gray-600 mb-1">
                    {t('Peso')} (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="weight-input"
                    type="number"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    value={profile.weight === 0 ? '' : profile.weight}
                    placeholder="0"
                    onChange={e => handleInputChange('weight', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="height-input" className="block text-gray-600 mb-1">
                    {t('Altura')} (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="height-input"
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
            <>
              <h2 className="text-xl font-bold text-red-700 mb-4">{t('Experiencia Deportiva')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">{t('Nivel de experiencia')} <span className="text-red-500">*</span></label>
                  <Select options={experienceOptions} value={experienceOptions.find(o => o.value === profile.experience)} onChange={o => handleInputChange('experience', o?.value)} styles={selectStyles} placeholder={t('Selecciona...')} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">{t('Frecuencia de entrenamiento')} <span className="text-red-500">*</span></label>
                  <Select options={frequencyOptions} value={frequencyOptions.find(o => o.value === profile.frequency)} onChange={o => handleInputChange('frequency', o?.value)} styles={selectStyles} placeholder={t('Selecciona...')} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">{t('Deporte principal')} <span className="text-red-500">*</span></label>
                  <Select options={sportOptions} value={sportOptions.find(o => o.value === profile.sport)} onChange={o => handleInputChange('sport', o?.value)} styles={selectStyles} placeholder={t('Selecciona...')} />
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-red-700 mb-4">{t('Salud y Objetivos')}</h2>
              <div>
                <label className="block text-gray-600 mb-1">
                  {t('Objetivo principal')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={profile.objective}
                  onChange={e => handleInputChange('objective', e.target.value)}
                  placeholder={t('Ejemplo: Ganar masa muscular, perder peso')}
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-600 mb-1">
                  {t('Condiciones médicas')}
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={medicalConditionsInput}
                  onChange={e => setMedicalConditionsInput(e.target.value)}
                  placeholder={t('Ejemplo: Asma, Diabetes')}
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-600 mb-1">
                  {t('Alergias')}
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={allergiesInput}
                  onChange={e => setAllergiesInput(e.target.value)}
                  placeholder={t('Ejemplo: Lactosa, Gluten')}
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-600 mb-1">
                  {t('Suplementos actuales')}
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-4 py-2 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  value={currentSupplementsInput}
                  onChange={e => setCurrentSupplementsInput(e.target.value)}
                  placeholder={t('Ejemplo: Proteína, Creatina')}
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-16 flex justify-between items-center">
          <div>
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                &larr; {t('Anterior')}
              </button>
            )}
          </div>

          <div>
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                {t('Siguiente')} &rarr;
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                {isEditing ? t('Actualizar perfil') : t('Finalizar')}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default StepForm; 