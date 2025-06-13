import React, { useState, ComponentType } from 'react';
import { UserProfile } from '../types';
import { sportProfiles } from '../data/supplements';
import { FaUser, FaRuler, FaDumbbell, FaHeartbeat } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface StepFormProps {
  onComplete: (profile: UserProfile) => void;
}

const stepIcons: IconType[] = [FaUser, FaRuler, FaDumbbell, FaHeartbeat];

const StepForm: React.FC<StepFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: 0,
    gender: 'male',
    weight: 0,
    height: 0,
    sport: '',
    trainingFrequency: 'medium',
    goals: '',
    experience: 'beginner',
    dietaryRestrictions: '',
    medicalConditions: ''
  });

  const steps = [
    {
      title: "Información Personal",
      fields: [
        {
          label: "Edad",
          type: "number",
          key: "age",
          placeholder: "Ingresa tu edad",
          required: true
        },
        {
          label: "Género",
          type: "select",
          key: "gender",
          options: [
            { value: "male", label: "Masculino" },
            { value: "female", label: "Femenino" },
            { value: "other", label: "Otro" }
          ],
          required: true
        }
      ]
    },
    {
      title: "Medidas Corporales",
      fields: [
        {
          label: "Peso (kg)",
          type: "number",
          key: "weight",
          placeholder: "Ingresa tu peso en kilogramos",
          required: true
        },
        {
          label: "Altura (cm)",
          type: "number",
          key: "height",
          placeholder: "Ingresa tu altura en centímetros",
          required: true
        }
      ]
    },
    {
      title: "Experiencia Deportiva",
      fields: [
        {
          label: "Nivel de Experiencia",
          type: "select",
          key: "experience",
          options: [
            { value: "beginner", label: "Principiante" },
            { value: "intermediate", label: "Intermedio" },
            { value: "advanced", label: "Avanzado" }
          ],
          required: true
        },
        {
          label: "Deporte Principal",
          type: "select",
          key: "sport",
          options: sportProfiles.map(sport => ({
            value: sport.name,
            label: sport.name
          })),
          required: true
        },
        {
          label: "Frecuencia de Entrenamiento",
          type: "select",
          key: "trainingFrequency",
          options: [
            { value: "low", label: "Baja (1-2 veces/semana)" },
            { value: "medium", label: "Media (3-4 veces/semana)" },
            { value: "high", label: "Alta (5+ veces/semana)" }
          ],
          required: true
        }
      ]
    },
    {
      title: "Salud y Objetivos",
      fields: [
        {
          label: "Objetivos (separa varios por coma)",
          type: "text",
          key: "goals",
          placeholder: "Ejemplo: Ganar masa muscular, Definir, Mejorar resistencia",
          required: false
        },
        {
          label: "Restricciones alimentarias (separa varias por coma)",
          type: "text",
          key: "dietaryRestrictions",
          placeholder: "Ejemplo: Sin gluten, Vegano, Sin lactosa",
          required: false
        },
        {
          label: "Condiciones médicas (separa varias por coma)",
          type: "text",
          key: "medicalConditions",
          placeholder: "Ejemplo: Diabetes, Hipertensión",
          required: false
        }
      ]
    }
  ];

  const handleInputChange = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      const processedProfile = {
        ...profile,
        goals: typeof profile.goals === 'string' ? profile.goals.split(',').map(v => v.trim()).filter(Boolean) : [],
        dietaryRestrictions: typeof profile.dietaryRestrictions === 'string' ? profile.dietaryRestrictions.split(',').map(v => v.trim()).filter(Boolean) : [],
        medicalConditions: typeof profile.medicalConditions === 'string' ? profile.medicalConditions.split(',').map(v => v.trim()).filter(Boolean) : [],
      };
      onComplete(processedProfile);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-red-100 animate-fade-in">
      {/* Barra de progreso visual */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold border-4 transition-all duration-300
                    ${index + 1 === currentStep
                      ? 'bg-red-600 text-white border-red-600 shadow-lg scale-110'
                      : index + 1 < currentStep
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-200 text-gray-400 border-gray-200'}`}
                >
                  {Icon ? React.createElement(Icon as any) : null}
                </div>
                <span className={`mt-2 text-xs font-semibold ${index + 1 === currentStep ? 'text-red-600' : 'text-gray-500'}`}>{step.title}</span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-gradient-to-r from-red-500 to-red-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-red-700 mb-8 tracking-tight drop-shadow-sm animate-fade-in">
        {currentStepData.title}
      </h2>

      <div className="space-y-8">
        {currentStepData.fields.map((field) => (
          <div key={field.key} className="">
            <label className="block text-base font-semibold text-gray-700 mb-2">
              {field.label}
            </label>
            {field.type === "select" ? (
              <div className="relative">
                <select
                  value={profile[field.key as keyof UserProfile] as string}
                  onChange={(e) => handleInputChange(field.key as keyof UserProfile, e.target.value)}
                  className="w-full p-3 pr-10 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 text-gray-800 font-medium transition-all duration-200 appearance-none shadow-sm"
                  required={field.required}
                >
                  <option value="">Selecciona una opción</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-red-400 text-lg">
                  ▼
                </span>
              </div>
            ) : (
              <input
                type={field.type}
                value={profile[field.key as keyof UserProfile] as string}
                onChange={(e) => handleInputChange(field.key as keyof UserProfile, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 text-gray-800 font-medium transition-all duration-200 shadow-sm"
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-between gap-4">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="px-8 py-3 bg-white border-2 border-red-400 text-red-600 font-bold rounded-xl shadow hover:bg-red-50 hover:border-red-600 transition-all duration-200 flex items-center gap-2"
          >
            ← Anterior
          </button>
        )}
        <button
          onClick={handleNext}
          className={`px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center gap-2 ${currentStep === 1 ? 'ml-auto' : ''}`}
        >
          {currentStep === steps.length ? <span>Finalizar</span> : <span>Siguiente →</span>}
        </button>
      </div>
    </div>
  );
};

export default StepForm; 