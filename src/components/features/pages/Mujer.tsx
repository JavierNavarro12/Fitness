import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { searchableContent } from '../../../data/content';
import { Helmet } from 'react-helmet-async';

const mujerData = searchableContent.filter(item => item.category === 'mujer');

const MujerCard = ({ id, title, image, content, icon }: { id: string, title: string, image: string, content: string, icon: React.ReactNode }) => {
  const { t } = useTranslation();
  const translatedContent = t(content);
  const puntosClave = translatedContent.split('.').map((s: string) => {
    const parts = s.trim().split(':');
    return { nombre: parts[0], desc: parts.slice(1).join(':').trim() };
  }).filter((s: { nombre: string; desc: string }) => s.nombre && s.desc);

  return (
    <div id={id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col" data-aos="fade-up">
      {image && <img src={image} alt={t(title)} className="w-full h-48 object-cover" />}
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-pink-500 mb-4" data-aos="zoom-in">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex-grow" data-aos="fade-right">{t(title)}</h3>
        {puntosClave.length > 0 ? (
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            {puntosClave.map((punto: { nombre: string, desc: string }, index: number) => (
              <li key={index} className="flex items-start" data-aos="fade-left" data-aos-delay={100 + index * 100}>
                <span className="text-pink-500 mr-2 mt-1">&#10003;</span>
                <span><strong>{punto.nombre}:</strong> {punto.desc}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300" data-aos="fade-up" data-aos-delay="100">{translatedContent}</p>
        )}
      </div>
    </div>
);
};

interface PageProps {
  itemToHighlight: { page: string; id: string } | null;
  onHighlightComplete: () => void;
}

const Mujer: React.FC<PageProps> = ({ itemToHighlight, onHighlightComplete }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (itemToHighlight && itemToHighlight.page === 'mujer') {
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
    <svg key="heart" className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
    </svg>,
    <svg key="venus" className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
    </svg>,
    <svg key="meditation" className="w-10 h-10" stroke="currentColor" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.75 8.75C4.75 7.09315 6.09315 5.75 7.75 5.75H16.25C17.9069 5.75 19.25 7.09315 19.25 8.75V11.25C19.25 12.9069 17.9069 14.25 16.25 14.25H7.75C6.09315 14.25 4.75 12.9069 4.75 11.25V8.75Z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 14.25L3.25 19.25H20.75L19 14.25"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5.75V4.75"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 5.75V4.75"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 5.75V4.75"></path>
    </svg>
  ];

  return (
    <>
      <Helmet>
        <title>Suplementación para la Mujer - EGN Fitness</title>
        <meta
          name="description"
          content="Encuentra suplementos diseñados para la mujer. Aprende sobre equilibrio hormonal, salud de la piel y cómo adaptar la suplementación a tu ciclo."
        />
      </Helmet>
      <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg" data-aos="fade-in">
            <div className="text-center mb-16" data-aos="fade-in">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 dark:text-pink-400 tracking-tight">{t('mujer.title')}</h1>
              <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300" data-aos="fade-up" data-aos-delay="200">
                {t('mujer.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {mujerData.map((item, index) => (
                <MujerCard {...item} icon={cardIcons[index]} key={item.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mujer; 