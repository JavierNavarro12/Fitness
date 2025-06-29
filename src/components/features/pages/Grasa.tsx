import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { searchableContent } from '../../../data/content';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

const grasaData = searchableContent.filter(item => item.category === 'grasa');

const GrasaCard = ({
  id,
  title,
  image,
  content,
  icon,
}: {
  id: string;
  title: string;
  image: string;
  content: string;
  icon: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const translatedContent = t(content);
  const isHtml = /<b>|<br\s*\/?\s*>/i.test(translatedContent);
  const puntosClave =
    !isHtml &&
    translatedContent
      .split('.')
      .map((s: string) => {
        const parts = s.trim().split(':');
        return { nombre: parts[0], desc: parts.slice(1).join(':').trim() };
      })
      .filter((s: { nombre: string; desc: string }) => s.nombre && s.desc);

  const puntosClaveArr = Array.isArray(puntosClave) ? puntosClave : [];

  return (
    <div
      id={id}
      className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col'
      data-aos='fade-up'
    >
      <div className={`relative ${image ? 'h-48' : 'h-10'}`}>
        {image && (
          <img
            src={image}
            alt={t(title)}
            className='w-full h-full object-cover'
          />
        )}
      </div>
      <div className='p-6 flex-1 flex flex-col items-center text-center'>
        <div className='text-red-500 mb-4' data-aos='zoom-in'>
          {icon}
        </div>
        {isHtml ? (
          <div
            className='text-gray-600 dark:text-gray-300 text-left w-full'
            data-aos='fade-up'
            data-aos-delay='100'
            dangerouslySetInnerHTML={{ __html: translatedContent }}
          />
        ) : puntosClaveArr.length > 0 ? (
          <ul className='space-y-3 text-gray-600 dark:text-gray-300 text-left'>
            {puntosClaveArr.map(
              (punto: { nombre: string; desc: string }, index: number) => (
                <li
                  key={index}
                  className='flex items-start'
                  data-aos='fade-left'
                  data-aos-delay={100 + index * 100}
                >
                  <span className='text-red-500 mr-2 mt-1'>&#10003;</span>
                  <span>
                    <strong>{punto.nombre}:</strong> {punto.desc}
                  </span>
                </li>
              )
            )}
          </ul>
        ) : (
          <p
            className='text-gray-600 dark:text-gray-300'
            data-aos='fade-up'
            data-aos-delay='100'
          >
            {translatedContent}
          </p>
        )}
      </div>
    </div>
  );
};

interface PageProps {
  itemToHighlight: { page: string; id: string } | null;
  onHighlightComplete: () => void;
}

const Grasa: React.FC<PageProps> = ({
  itemToHighlight,
  onHighlightComplete,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (itemToHighlight && itemToHighlight.page === 'grasa') {
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

  const cardIcons = [
    <svg
      key='fire'
      className='w-10 h-10'
      fill='currentColor'
      viewBox='0 0 20 20'
    >
      <path
        fillRule='evenodd'
        d='M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.08-2.747c-.33-.33-.654-.715-.927-1.157a3.117 3.117 0 00-.235-1.559zM5.5 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'
        clipRule='evenodd'
      />
    </svg>,
    <svg
      key='target'
      className='w-10 h-10'
      fill='currentColor'
      viewBox='0 0 20 20'
    >
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
        clipRule='evenodd'
      />
    </svg>,
    <svg
      key='scale'
      className='w-10 h-10'
      stroke='currentColor'
      fill='none'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
      />
    </svg>,
  ];

  return (
    <>
      <Helmet>
        <title>Suplementos para Quema de Grasa - EGN Fitness</title>
        <meta
          name='description'
          content='Descubre suplementos efectivos para la quema de grasa y el control del apetito. Aprende sobre termogénicos y los fundamentos para perder peso.'
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
                src='https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                alt={t('grasa.title')}
                className='w-full h-64 sm:h-80 object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20'></div>
              <div className='absolute bottom-0 left-0 p-6 sm:p-8'>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight'>
                  {t('grasa.title')}
                </h1>
              </div>
            </div>
            <div
              className='max-w-4xl mx-auto text-center mb-4'
              data-aos='fade-up'
              data-aos-delay='200'
            >
              <p className='text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300'>
                {t('grasa.description')}
              </p>
            </div>
            <div
              className='max-w-6xl mx-auto mb-8'
              data-aos='fade-up'
              data-aos-delay='300'
            >
              <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
                {t('grasa.stats.title')}
              </h2>
              <div className='grid md:grid-cols-3 gap-6'>
                <div
                  className='bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-red-100/80 dark:hover:bg-red-900/40 cursor-pointer'
                  data-aos='fade-up'
                  data-aos-delay='400'
                >
                  <div className='text-red-600 dark:text-red-400 text-2xl font-bold mb-2'>
                    3-10%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('grasa.stats.termogenicos')}
                  </p>
                </div>
                <div
                  className='bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-orange-100/80 dark:hover:bg-orange-900/40 cursor-pointer'
                  data-aos='fade-up'
                  data-aos-delay='500'
                >
                  <div className='text-orange-600 dark:text-orange-400 text-2xl font-bold mb-2'>
                    78%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('grasa.stats.apetito')}
                  </p>
                </div>
                <div
                  className='bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-yellow-100/80 dark:hover:bg-yellow-900/40 cursor-pointer'
                  data-aos='fade-up'
                  data-aos-delay='600'
                >
                  <div className='text-yellow-600 dark:text-yellow-400 text-2xl font-bold mb-2'>
                    35%
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {t('grasa.stats.fundamentos')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque: Termogénicos */}
          <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg py-10 px-4 md:px-10 mb-12 max-w-7xl mx-auto'>
            <h2
              className='text-2xl font-semibold text-red-700 dark:text-red-300 mb-8 mt-8 text-center'
              data-aos='fade-in'
            >
              {t('grasa.termogenicos.title')}
            </h2>
            <div className='grid md:grid-cols-2 gap-8'>
              {grasaData
                .filter(item =>
                  [
                    'grasa.termogenicos.title',
                    'grasa.metabolismo-energetico.title',
                  ].includes(item.title)
                )
                .map((item, index) => (
                  <GrasaCard {...item} icon={cardIcons[index]} key={item.id} />
                ))}
            </div>
          </div>

          {/* Bloque: Control del Apetito */}
          <div className='bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl py-14 px-4 md:px-12 mb-8 max-w-4xl mx-auto shadow-2xl mt-24'>
            <h2 className='text-2xl font-bold text-center text-red-600 dark:text-red-400 mb-8'>
              {t('grasa.apetito.title')}
            </h2>
            <div className='grid md:grid-cols-1 gap-10'>
              {grasaData
                .filter(item => ['grasa.apetito.title'].includes(item.title))
                .map((item, index) => (
                  <GrasaCard {...item} icon={cardIcons[index]} key={item.id} />
                ))}
            </div>
          </div>

          {/* Bloque: Fundamentos de la Quema de Grasa */}
          <div className='bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl py-14 px-4 md:px-12 mb-8 max-w-4xl mx-auto shadow-2xl mt-24'>
            <h2 className='text-2xl font-bold text-center text-yellow-700 dark:text-yellow-300 mb-8'>
              {t('grasa.fundamentos.title')}
            </h2>
            <div className='grid md:grid-cols-1 gap-10'>
              {grasaData
                .filter(item =>
                  ['grasa.fundamentos.title'].includes(item.title)
                )
                .map((item, index) => (
                  <GrasaCard {...item} icon={cardIcons[index]} key={item.id} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Grasa;
