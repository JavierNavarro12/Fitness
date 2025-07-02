import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

interface HomeProps {
  onStart: () => void;
}

const fitnessImages = [
  { src: '/fitness-2.webp', alt: 'Fitness 2', order: 'md:order-2' },
  { src: '/fitness-1.webp', alt: 'Fitness 1', order: 'md:order-1' },
  { src: '/fitness-3.webp', alt: 'Fitness 3', order: 'md:order-3' },
];

const visualCards = [
  {
    title: 'Rendimiento cardiovascular',
    img: '/imagen-inicio.webp',
    alt: 'Grupo de personas corriendo',
  },
];

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const { t } = useTranslation();
  const lcpImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (lcpImgRef.current) {
      lcpImgRef.current.setAttribute('fetchpriority', 'high');
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>EGN Fitness - Suplementación Deportiva con IA</title>
        <meta
          name='description'
          content='Tu guía de suplementación deportiva inteligente. Obtén reportes personalizados con IA, consulta a nuestro asistente virtual y alcanza tus objetivos de fitness.'
        />
      </Helmet>
      {/* Móvil: nuevo diseño visual */}
      <div className='sm:hidden max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 flex flex-col items-center min-h-[calc(100vh-11rem)]'>
        <div className='flex flex-col items-center flex-1'>
          <h2 className='text-3xl font-bold text-red-600 mb-4 text-center flex items-center justify-center gap-2'>
            Bienvenido a EGN
          </h2>
          <p className='text-lg text-gray-700 dark:text-gray-200 mb-6 text-center'>
            Tu asesor inteligente en suplementación deportiva
          </p>
          <button
            onClick={onStart}
            className='bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-xl transition-all duration-200 mb-8'
          >
            Comienza ahora →
          </button>
          <ul className='text-left text-base space-y-4 w-full max-w-md mx-auto'>
            <li className='flex items-center gap-2'>
              <span>🧠</span> Asesoramiento inteligente con IA
            </li>
            <li className='flex items-center gap-2'>
              <span>📊</span> Informes personalizados según tu perfil
            </li>
            <li className='flex items-center gap-2'>
              <span>💪</span> Mejora tu rendimiento y salud con suplementación
              adecuada
            </li>
            <li className='flex items-center gap-2'>
              <span>🤖</span> Resuelve tus dudas con nuestra IA experta
            </li>
          </ul>
        </div>
        {/* Solo mostrar la primera imagen en móvil */}
        <div className='mt-4 w-full'>
          <img
            src={visualCards[0].img}
            alt={visualCards[0].alt}
            className='w-full h-48 object-cover rounded-xl shadow-md'
            loading='lazy'
          />
        </div>
      </div>

      {/* Desktop: diseño con imágenes */}
      <div className='hidden sm:flex sm:flex-col sm:items-center sm:justify-between max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mt-8 mb-8 min-h-[calc(100vh-12rem)]'>
        <h2 className='text-3xl font-bold text-red-600 mb-4 text-center'>
          {t('home.welcome')}
        </h2>
        <p className='text-lg text-gray-700 dark:text-gray-200 mb-6 text-center'>
          {t('home.description')}
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full'>
          {fitnessImages.map((img, i) => (
            <img
              key={i}
              ref={i === 1 ? lcpImgRef : undefined} // fitness-1.webp es el índice 1
              src={img.src}
              alt={img.alt}
              className={`rounded-xl shadow-md object-cover w-full h-48 ${img.order}`}
              width={600}
              height={400}
              loading={i === 1 ? 'eager' : 'lazy'} // Solo fitness-1.webp eager
              decoding='async'
              fetchPriority={i === 1 ? 'high' : 'low'}
            />
          ))}
        </div>
        <div className='bg-red-50 dark:bg-gray-900 border-l-4 border-red-400 dark:border-red-300 p-4 rounded-xl text-red-600 text-center mb-6'>
          <strong>{t('home.cta.ready')}</strong> {t('home.cta.goTo')}{' '}
          <span className='font-bold'>{t('home.cta.personalize')}</span>{' '}
          {t('home.cta.getRecommendations')}
        </div>
        <div className='flex justify-center w-full'>
          <button
            onClick={onStart}
            className='bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-xl transition-all duration-200'
          >
            {t('home.cta.button')}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
