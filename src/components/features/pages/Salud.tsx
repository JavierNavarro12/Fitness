import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { searchableContent } from '../../../data/content';
import { Helmet } from 'react-helmet-async';

const saludData = searchableContent.filter(item => item.category === 'salud');

const SaludCard = ({
  id,
  title,
  image,
  content,
}: {
  id: string;
  title: string;
  image: string;
  content: string;
}) => {
  const { t } = useTranslation();
  const translatedContent = t(content);
  const intro = translatedContent.split('.')[0] + '.';
  const puntosClave = translatedContent
    .split('.')
    .slice(1)
    .map((s: string) => {
      const parts = s.trim().split(':');
      return { nombre: parts[0], desc: parts.slice(1).join(':').trim() };
    })
    .filter((s: { nombre: string; desc: string }) => s.nombre && s.desc);

  return (
    <div
      id={id}
      className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-12 transform hover:-translate-y-2 transition-transform duration-300'
      data-aos='fade-up'
    >
      {image && (
        <img
          src={image}
          alt={t(title)}
          className='w-full h-56 object-cover'
          data-aos='zoom-in'
          data-aos-delay='200'
        />
      )}
      <div className='p-6'>
        <h2
          className='text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3'
          data-aos='fade-right'
          data-aos-delay='300'
        >
          {t(title)}
        </h2>
        <p
          className='text-gray-700 dark:text-gray-300 mb-6'
          data-aos='fade-up'
          data-aos-delay='400'
        >
          {intro}
        </p>
        <div data-aos='fade-up' data-aos-delay='500'>
          <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b-2 border-blue-200 pb-2'>
            {t('salud.card.puntosClave')}
          </h3>
          <ul className='space-y-4 mt-4'>
            {puntosClave.map(
              (punto: { nombre: string; desc: string }, index: number) => (
                <li
                  key={punto.nombre}
                  data-aos='fade-left'
                  data-aos-delay={600 + index * 100}
                >
                  <strong className='font-semibold text-gray-800 dark:text-gray-200'>
                    {punto.nombre}:
                  </strong>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {punto.desc}
                  </p>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface PageProps {
  itemToHighlight: { page: string; id: string } | null;
  onHighlightComplete: () => void;
}

const Salud: React.FC<PageProps> = ({
  itemToHighlight,
  onHighlightComplete,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (itemToHighlight && itemToHighlight.page === 'salud') {
      const timer = setTimeout(() => {
        const element = document.getElementById(itemToHighlight.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.transition = 'all 0.3s ease-in-out';
          element.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.5)';
          setTimeout(() => {
            element.style.boxShadow = '';
          }, 2000);
        }
        onHighlightComplete();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [itemToHighlight, onHighlightComplete]);

  return (
    <>
      <Helmet>
        <title>Suplementos para Salud y Bienestar - EGN Fitness</title>
        <meta
          name='description'
          content='Mejora tu bienestar general con suplementos clave. Aprende sobre vitaminas esenciales, minerales, antioxidantes y Omega-3 para una salud óptima.'
        />
      </Helmet>
      <div className='p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10'>
            <div
              className='relative rounded-2xl overflow-hidden mb-12 shadow-lg'
              data-aos='fade-in'
            >
              <img
                src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                alt={t('salud.title')}
                className='w-full h-64 sm:h-80 object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20'></div>
              <div className='absolute bottom-0 left-0 p-6 sm:p-8'>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight'>
                  {t('salud.title')}
                </h1>
              </div>
            </div>

            <div
              className='max-w-4xl mx-auto text-center mb-16'
              data-aos='fade-up'
              data-aos-delay='200'
            >
              <p className='text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300'>
                {t('salud.description')}
              </p>
            </div>

            {/* Estadísticas de Salud Global */}
            <div
              className='max-w-6xl mx-auto mb-16'
              data-aos='fade-up'
              data-aos-delay='300'
            >
              <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
                {t('salud.stats.title')}
              </h2>
              <div className='grid md:grid-cols-3 gap-6'>
                <div
                  className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700'
                  data-aos='fade-up'
                  data-aos-delay='400'
                >
                  <div className='text-blue-600 dark:text-blue-400 text-2xl font-bold mb-2'>
                    42%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('salud.stats.vitaminas')}
                  </p>
                </div>
                <div
                  className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-700'
                  data-aos='fade-up'
                  data-aos-delay='500'
                >
                  <div className='text-green-600 dark:text-green-400 text-2xl font-bold mb-2'>
                    75%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('salud.stats.minerales')}
                  </p>
                </div>
                <div
                  className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700'
                  data-aos='fade-up'
                  data-aos-delay='600'
                >
                  <div className='text-purple-600 dark:text-purple-400 text-2xl font-bold mb-2'>
                    10%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('salud.stats.omega3')}
                  </p>
                </div>
              </div>
            </div>

            <div className='max-w-4xl mx-auto'>
              {saludData.map((item, index) => (
                <div
                  key={item.id}
                  data-aos='fade-up'
                  data-aos-delay={index * 200}
                >
                  <SaludCard {...item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Salud;
