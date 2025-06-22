import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { searchableContent } from '../../../data/content';

const cognitivoData = searchableContent.filter(item => item.category === 'cognitivo');

const CognitivoCard = ({ id, title, content, icon, image }: { id: string, title: string, content: string, icon: React.ReactNode, image: string }) => {
  const { t } = useTranslation();
  const translatedContent = t(content);
  const puntosClave = translatedContent.split('.').map((s: string) => {
    const parts = s.trim().split(':');
    return { nombre: parts[0], desc: parts.slice(1).join(':').trim() };
  }).filter((s: { nombre: string; desc: string }) => s.nombre && s.desc);

  return (
    <div id={id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden" data-aos="fade-up">
      <div className="h-40">
        <img src={image} alt={t(title)} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 flex flex-col items-center text-center flex-1">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="text-purple-500" data-aos="zoom-in">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white" data-aos="fade-right">{t(title)}</h3>
          </div>
          {puntosClave.length > 0 ? (
            <ul className="space-y-3 text-left text-gray-600 dark:text-gray-300">
              {puntosClave.map((punto: { nombre: string, desc: string }, index: number) => (
                <li key={index} className="flex items-start" data-aos="fade-left" data-aos-delay={100 + index * 100}>
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span><strong>{punto.nombre}:</strong> {punto.desc}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center" data-aos="fade-up" data-aos-delay="100">{translatedContent}</p>
          )}
      </div>
    </div>
  );
};

interface PageProps {
  itemToHighlight: { page: string; id: string } | null;
  onHighlightComplete: () => void;
}

const Cognitivo: React.FC<PageProps> = ({ itemToHighlight, onHighlightComplete }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (itemToHighlight && itemToHighlight.page === 'cognitivo') {
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
    <svg key="lightbulb" className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
    </svg>,
    <svg key="shield" className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
    </svg>,
    <svg key="beaker" className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 01.936-.528l1.752.875a.75.75 0 010 1.352l-1.752.875a.75.75 0 01-.936-.528v-1.047z" clipRule="evenodd" />
    </svg>,
    <svg key="check-circle" className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
    </svg>
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">
      <div className="text-center mb-16" data-aos="fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">{t('Rendimiento Cognitivo')}</h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300" data-aos="fade-up" data-aos-delay="200">
          {t('Tu cerebro es tu activo más importante. Descubre cómo la suplementación puede potenciar tu enfoque, memoria y resistencia al estrés para un máximo rendimiento mental.')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {cognitivoData.map((item, index) => (
          <CognitivoCard {...item} icon={cardIcons[index]} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default Cognitivo; 