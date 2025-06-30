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
    img: '/fitness-1.webp',
    alt: 'Grupo de personas corriendo',
  },
  {
    title: 'Entrenamiento de fuerza',
    img: '/fitness-2.webp',
    alt: 'Entrenamiento de fuerza en gimnasio',
  },
  {
    title: 'Wellness',
    img: '/fitness-3.webp',
    alt: 'Persona haciendo estiramientos o yoga',
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
      <div
        className='sm:hidden max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-between min-h-[calc(100vh-8rem)]'
        data-aos='fade-up'
      >
        <h2
          className='text-3xl font-bold text-red-600 mb-2 text-center flex items-center justify-center gap-2'
          data-aos='fade-down'
          data-aos-delay='200'
        >
          <span role='img' aria-label='saludo'>
            👋
          </span>{' '}
          Bienvenido a EGN
        </h2>
        <p
          className='text-lg text-gray-700 dark:text-gray-200 mb-4 text-center'
          data-aos='fade-up'
          data-aos-delay='400'
        >
          Tu asesor inteligente en suplementación deportiva
        </p>
        <button
          onClick={onStart}
          className='bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-xl transition-all duration-200 mb-4'
          data-aos='zoom-in'
          data-aos-delay='600'
        >
          Comienza ahora →
        </button>
        <ul className='text-left text-base mb-6 space-y-2 w-full max-w-md mx-auto'>
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
        <div className='grid grid-cols-1 gap-4 w-full max-w-2xl mx-auto mb-4'>
          {visualCards.map((card, i) => (
            <div
              key={i}
              className='rounded-xl shadow-md bg-gray-100 dark:bg-gray-700 flex flex-col items-center p-2'
            >
              {card.img ? (
                <img
                  src={card.img}
                  alt={card.alt}
                  className='rounded-lg object-cover w-full h-36 mb-2'
                />
              ) : (
                <div className='w-full h-36 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-lg mb-2'>
                  <span className='text-4xl text-gray-400'>🖼️</span>
                </div>
              )}
              <div className='text-center font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1'>
                {card.title}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Escritorio: diseño original */}
      <div
        className='hidden sm:block max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-between mt-16 mb-8'
        data-aos='fade-up'
      >
        <h2
          className='text-3xl font-bold text-red-600 mb-4 text-center'
          data-aos='fade-down'
          data-aos-delay='200'
        >
          {t('home.welcome')}
        </h2>
        <p
          className='text-lg text-gray-700 dark:text-gray-200 mb-6 text-center'
          data-aos='fade-up'
          data-aos-delay='400'
        >
          {t('home.description')}
        </p>
        <div
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full'
          data-aos='zoom-in'
          data-aos-delay='600'
        >
          {fitnessImages.map((img, i) => (
            <img
              key={i}
              ref={i === 0 ? lcpImgRef : undefined}
              src={img.src}
              alt={img.alt}
              className={`rounded-xl shadow-md object-cover w-full h-48 ${img.order}`}
              width={600}
              height={400}
              loading='eager'
              decoding='async'
              data-aos='fade-up'
              data-aos-delay={800 + i * 200}
            />
          ))}
        </div>
        <div
          className='bg-red-50 dark:bg-gray-900 border-l-4 border-red-400 dark:border-red-300 p-4 rounded-xl text-red-600 text-center mb-6'
          data-aos='fade-up'
          data-aos-delay='1000'
        >
          <strong>{t('home.cta.ready')}</strong> {t('home.cta.goTo')}{' '}
          <span className='font-bold'>{t('home.cta.personalize')}</span>{' '}
          {t('home.cta.getRecommendations')}
        </div>
        <div className='flex justify-center w-full'>
          <button
            onClick={onStart}
            className='bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-xl transition-all duration-200'
            data-aos='zoom-in'
            data-aos-delay='1200'
          >
            {t('home.cta.button')}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
