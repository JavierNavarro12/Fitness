import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

interface HomeProps {
  onStart: () => void;
}

const fitnessImages = [
  '/fitness-2.webp',
  '/fitness-1.webp',
  '/fitness-3.webp',
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
          name="description" 
          content="Tu guía de suplementación deportiva inteligente. Obtén reportes personalizados con IA, consulta a nuestro asistente virtual y alcanza tus objetivos de fitness." 
        />
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-between min-h-[calc(100vh-8rem)]" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-red-600 mb-4 text-center" data-aos="fade-down" data-aos-delay="200">{t('home.welcome')}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 text-center" data-aos="fade-up" data-aos-delay="400">
          {t('home.description')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full" data-aos="zoom-in" data-aos-delay="600">
          {fitnessImages.map((src, i) => (
            <img
              key={i}
              ref={i === 0 ? lcpImgRef : undefined}
              src={src}
              alt={`Fitness ${i+1}`}
              className="rounded-xl shadow-md object-cover w-full h-48"
              width={600}
              height={400}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              data-aos="fade-up"
              data-aos-delay={800 + i * 200}
            />
          ))}
        </div>
        <div className="bg-red-50 dark:bg-gray-900 border-l-4 border-red-400 dark:border-red-300 p-4 rounded-xl text-red-600 text-center" data-aos="fade-up" data-aos-delay="1000">
          <strong>{t('home.cta.ready')}</strong> {t('home.cta.goTo')} <span className="font-bold">{t('home.cta.personalize')}</span> {t('home.cta.getRecommendations')}
        </div>
        <button
          onClick={onStart}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-xl transition-all duration-200 mt-6"
          data-aos="zoom-in"
          data-aos-delay="1200"
        >
          {t('home.cta.button')}
        </button>
      </div>
    </>
  );
};

export default Home; 