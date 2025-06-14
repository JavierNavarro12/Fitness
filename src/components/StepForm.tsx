import React, { useState } from 'react';
import { UserProfile } from '../types';
import { FaUser, FaRuler, FaDumbbell, FaHeartbeat } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { sportProfiles } from '../data/supplements';

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

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
      {/* Wizard Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((s, i) => {
          const Icon = s.icon as React.FC<{ size?: number }>;
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className={`rounded-full p-3 mb-2 ${i === step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {Icon ? <Icon size={28} /> : null}
              </div>
              <span className={`text-xs font-semibold ${i === step ? 'text-red-600' : 'text-gray-500'}`}>{s.label}</span>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 0 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Edad</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={profile.age === 0 ? '' : profile.age}
                  placeholder="0"
                  onChange={e => handleInputChange('age', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Género</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={profile.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  required
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">Medidas Corporales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={profile.weight === 0 ? '' : profile.weight}
                  placeholder="0"
                  onChange={e => handleInputChange('weight', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={profile.height === 0 ? '' : profile.height}
                  placeholder="0"
                  onChange={e => handleInputChange('height', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">Experiencia Deportiva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Nivel de experiencia</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={profile.experience}
                  onChange={e => handleInputChange('experience', e.target.value)}
                  required
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Frecuencia de entrenamiento</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={profile.frequency}
                  onChange={e => handleInputChange('frequency', e.target.value)}
                  required
                >
                  <option value="low">Baja (1-2 veces/semana)</option>
                  <option value="medium">Media (3-4 veces/semana)</option>
                  <option value="high">Alta (5+ veces/semana)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 mb-1">Deporte principal</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={profile.sport || ''}
                  onChange={e => handleInputChange('sport', e.target.value)}
                  required
                >
                  <option value="">Selecciona un deporte</option>
                  {sportProfiles.map((sport) => (
                    <option key={sport.name} value={sport.name}>{sport.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-red-700 mb-4">Salud y Objetivos</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Objetivo</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={profile.objective}
                  onChange={e => handleInputChange('objective', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Condiciones médicas (opcional)</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={profile.medicalConditions?.join(', ') || ''}
                  onChange={e => handleInputChange('medicalConditions', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Separadas por comas"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Alergias (opcional)</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={profile.allergies?.join(', ') || ''}
                  onChange={e => handleInputChange('allergies', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Separadas por comas"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Suplementos actuales (opcional)</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={profile.currentSupplements?.join(', ') || ''}
                  onChange={e => handleInputChange('currentSupplements', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Separados por comas"
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
              ← Anterior
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-xl shadow"
              onClick={nextStep}
            >
              Siguiente →
            </button>
          )}
          {step === steps.length - 1 && (
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-2 rounded-xl shadow"
            >
              {isEditing ? 'Actualizar perfil' : 'Finalizar'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StepForm; 