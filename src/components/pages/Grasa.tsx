import React from 'react';
import { useTranslation } from 'react-i18next';
import { searchableContent } from '../../data/content';

const grasaData = searchableContent.filter(item => item.category === 'grasa');

const GrasaCard = ({ id, title, image, content, icon }: { id: string, title: string, image: string, content: string, icon: React.ReactNode }) => {
  const { t } = useTranslation();
  const translatedContent = t(content);
  const puntosClave = translatedContent.split('.').map((s: string) => {
    const parts = s.trim().split(':');
    return { nombre: parts[0], desc: parts.slice(1).join(':').trim() };
  }).filter((s: { nombre: string; desc: string }) => s.nombre && s.desc);

  return (
    <div id={id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col" data-aos="fade-up">
      <div className={`relative ${image ? 'h-48' : 'h-10'}`}>
        {image && <img src={image} alt={t(title)} className="w-full h-full object-cover" />}
      </div>
      <div className="p-6 flex-1 flex flex-col items-center text-center">
        <div className="text-red-500 mb-4" data-aos="zoom-in">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex-grow" data-aos="fade-right">{t(title)}</h3>
        {puntosClave.length > 0 ? (
          <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-left">
            {puntosClave.map((punto: { nombre: string, desc: string }, index: number) => (
              <li key={index} className="flex items-start" data-aos="fade-left" data-aos-delay={100 + index * 100}>
                <span className="text-red-500 mr-2 mt-1">&#10003;</span>
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

const Grasa = () => {
  const { t } = useTranslation();
  const cardIcons = [
    <svg key="fire" className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.08-2.747c-.33-.33-.654-.715-.927-1.157a3.117 3.117 0 00-.235-1.559zM5.5 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd"/>
    </svg>,
    <svg key="target" className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
    </svg>,
    <svg key="scale" className="w-10 h-10" stroke="currentColor" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">
      <div className="text-center mb-16" data-aos="fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">{t('Quema de Grasa Inteligente')}</h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300" data-aos="fade-up" data-aos-delay="200">
          {t('La pérdida de grasa es un objetivo común, pero requiere un enfoque estratégico. Descubre los suplementos que pueden optimizar tus esfuerzos, siempre como complemento a una dieta y entrenamiento adecuados.')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {grasaData.map((item, index) => (
          <GrasaCard {...item} icon={cardIcons[index]} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default Grasa; 