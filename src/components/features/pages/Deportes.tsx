import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { searchableContent } from '../../../data/content';

const deportesData = searchableContent.filter(item => item.category === 'deportes');

const DeporteCard = ({ id, title, image, content }: { id: string, title: string, image: string, content: string }) => {
  const { t } = useTranslation();
  const translatedContent = t(content);
  const intro = translatedContent.split('.')[0] + '.';
  const suplementos = translatedContent.split('.').slice(1).map((s: string) => {
    const parts = s.trim().split(':');
    return { nombre: parts[0], desc: parts.slice(1).join(':').trim() };
  }).filter((s: { nombre: string; desc: string }) => s.nombre && s.desc);

  return (
    <div id={id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-12 transform hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up">
      <img src={image} alt={t(title)} className="w-full h-56 object-cover" data-aos="zoom-in" data-aos-delay="200" />
    <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3" data-aos="fade-right" data-aos-delay="300">{t(title)}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6" data-aos="fade-up" data-aos-delay="400">{intro}</p>
        <div data-aos="fade-up" data-aos-delay="500">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b-2 border-red-200 pb-2">{t('Suplementos Clave')}</h3>
        <ul className="space-y-4 mt-4">
            {suplementos.map((sup: { nombre: string, desc: string }, index: number) => (
              <li key={sup.nombre} data-aos="fade-left" data-aos-delay={600 + index * 100}>
              <strong className="font-semibold text-gray-800 dark:text-gray-200">{sup.nombre}:</strong>
              <p className="text-gray-600 dark:text-gray-400">{sup.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  )
};

interface PageProps {
  itemToHighlight: { page: string; id: string } | null;
  onHighlightComplete: () => void;
}

const Deportes: React.FC<PageProps> = ({ itemToHighlight, onHighlightComplete }) => {
  const { t } = useTranslation();

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg" data-aos="fade-in">
        <img
          src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt={t('Rendimiento Deportivo')}
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            {t('Rendimiento por Deporte')}
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto text-center mb-16" data-aos="fade-up" data-aos-delay="200">
        <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
          {t('Cada disciplina tiene sus propias demandas. Descubre qué suplementos son los más efectivos para tu deporte, ya sea que busques fuerza, resistencia o una recuperación más rápida.')}
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {deportesData.map((deporte, index) => (
          <div key={deporte.id} data-aos="fade-up" data-aos-delay={index * 200}>
            <DeporteCard {...deporte} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deportes; 