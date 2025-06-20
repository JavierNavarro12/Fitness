import React from 'react';
import { useTranslation } from 'react-i18next';

interface HomeProps {
  onStart: () => void;
}

const fitnessImages = [
  'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
];

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-4 text-center">{t('Bienvenido a EGN')}</h2>
      <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 text-center">
        {t('EGN es tu asesor inteligente de suplementación deportiva. Personaliza tu perfil, genera informes profesionales y resuelve tus dudas con nuestra IA experta. ¡Optimiza tu rendimiento y salud con recomendaciones basadas en tu perfil y objetivos!')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full">
        {fitnessImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Fitness ${i+1}`}
            className="rounded-xl shadow-md object-cover w-full h-48"
          />
        ))}
      </div>
      <div className="bg-red-50 dark:bg-gray-900 border-l-4 border-red-400 dark:border-red-300 p-4 rounded-xl text-red-800 dark:text-red-200 text-center">
        <strong>{t('¿Listo para empezar?')}</strong> {t('Ve a la sección')} <span className="font-bold">{t('Personalización')}</span> {t('para crear tu perfil y obtener recomendaciones personalizadas.')}
      </div>
      <button
        onClick={onStart}
        className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-xl transition-all duration-200 mt-6"
      >
        {t('Comenzar ahora')}
      </button>
    </div>
  );
};

export default Home; 