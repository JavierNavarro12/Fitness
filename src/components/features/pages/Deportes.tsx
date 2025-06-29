import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { searchableContent } from '../../../data/content';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

const deportesData = searchableContent.filter(
  item => item.category === 'deportes'
);

const DeporteCard = ({
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
  const suplementos = translatedContent
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
      <img
        src={image}
        alt={t(title)}
        className='w-full h-56 object-cover'
        data-aos='zoom-in'
        data-aos-delay='200'
      />
      <div className='p-6'>
        <h2
          className='text-2xl font-bold text-red-600 dark:text-red-400 mb-3'
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
          <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b-2 border-red-200 pb-2'>
            {t('deportes.card.suplementos')}
          </h3>
          <ul className='space-y-4 mt-4'>
            {suplementos.map(
              (sup: { nombre: string; desc: string }, index: number) => (
                <li
                  key={sup.nombre}
                  data-aos='fade-left'
                  data-aos-delay={600 + index * 100}
                >
                  <strong className='font-semibold text-gray-800 dark:text-gray-200'>
                    {sup.nombre}:
                  </strong>
                  <p className='text-gray-600 dark:text-gray-400'>{sup.desc}</p>
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

const Deportes: React.FC<PageProps> = ({
  itemToHighlight,
  onHighlightComplete,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (itemToHighlight && itemToHighlight.page === 'deportes') {
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
        <title>Suplementos para Deportes - EGN Fitness</title>
        <meta
          name='description'
          content='Descubre los mejores suplementos para deportes de fuerza, resistencia y equipo. Optimiza tu rendimiento en levantamiento de pesas, crossfit, running y más.'
        />
      </Helmet>
      <div className='p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-10'>
            <div
              className='relative rounded-2xl overflow-hidden mb-6 shadow-lg'
              data-aos='fade-in'
            >
              <img
                src='https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                alt={t('Rendimiento Deportivo')}
                className='w-full h-64 sm:h-80 object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20'></div>
              <div className='absolute bottom-0 left-0 p-6 sm:p-8'>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight'>
                  {t('deportes.title')}
                </h1>
              </div>
            </div>
            <div
              className='max-w-4xl mx-auto text-center mb-4'
              data-aos='fade-up'
              data-aos-delay='200'
            >
              <p className='text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300'>
                {t('deportes.description')}
              </p>
            </div>
            <div
              className='max-w-6xl mx-auto mb-8'
              data-aos='fade-up'
              data-aos-delay='300'
            >
              <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
                {t('deportes.stats.title')}
              </h2>
              <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div
                  className='bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-red-100/80 dark:hover:bg-red-900/40 cursor-pointer'
                  data-aos='fade-up'
                  data-aos-delay='400'
                >
                  <div className='text-red-600 dark:text-red-400 text-2xl font-bold mb-2'>
                    67%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('deportes.stats.fitness')}
                  </p>
                </div>
                <div
                  className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-100/80 dark:hover:bg-blue-900/40 cursor-pointer'
                  data-aos='fade-up'
                  data-aos-delay='500'
                >
                  <div className='text-blue-600 dark:text-blue-400 text-2xl font-bold mb-2'>
                    23%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('deportes.stats.crossfit')}
                  </p>
                </div>
                <div
                  className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-green-100/80 dark:hover:bg-green-900/40 cursor-pointer'
                  data-aos='fade-up'
                  data-aos-delay='600'
                >
                  <div className='text-green-600 dark:text-green-400 text-2xl font-bold mb-2'>
                    89%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('deportes.stats.resistencia')}
                  </p>
                </div>
                <div
                  className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700'
                  data-aos='fade-up'
                  data-aos-delay='700'
                >
                  <div className='text-purple-600 dark:text-purple-400 text-2xl font-bold mb-2'>
                    40%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('deportes.stats.equipo')}
                  </p>
                </div>
              </div>
            </div>

            <div className='max-w-4xl mx-auto'>
              {deportesData.map((deporte, index) => (
                <div
                  key={deporte.id}
                  data-aos='fade-up'
                  data-aos-delay={index * 200}
                >
                  <DeporteCard {...deporte} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deportes;
