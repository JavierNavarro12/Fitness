import React from 'react';
import { useTranslation } from 'react-i18next';

interface FAQProps {
  setNav: (nav: string) => void;
}

const FAQ: React.FC<FAQProps> = ({ setNav }) => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: '¿Qué es EGN Fitness?',
      answer: 'EGN (Endless Goals Nutrition) es tu asesor inteligente de suplementación deportiva. Utilizamos IA avanzada para crear recomendaciones personalizadas basadas en tu perfil, objetivos y necesidades específicas.'
    },
    {
      question: '¿Cómo funciona la personalización?',
      answer: 'Completas un formulario detallado con tu información personal, deporte, experiencia, objetivos y condiciones médicas. Nuestra IA analiza estos datos para generar recomendaciones específicas para ti.'
    },
    {
      question: '¿Son seguras las recomendaciones?',
      answer: 'Nuestras recomendaciones son sugerencias generales basadas en evidencia científica. Siempre recomendamos consultar con un profesional de la salud antes de comenzar cualquier suplementación, especialmente si tienes condiciones médicas.'
    },
    {
      question: '¿Qué deportes cubre la aplicación?',
      answer: 'Cubrimos una amplia gama de deportes: desde levantamiento de pesas y culturismo hasta deportes de resistencia como running y ciclismo, deportes de equipo, CrossFit, yoga y muchos más.'
    },
    {
      question: '¿Puedo usar la app si soy principiante?',
      answer: '¡Absolutamente! Nuestras recomendaciones se adaptan a todos los niveles, desde principiantes hasta atletas avanzados. La suplementación se ajusta según tu experiencia y objetivos.'
    },
    {
      question: '¿Cómo se generan los informes?',
      answer: 'Utilizamos inteligencia artificial avanzada para analizar tu perfil y generar informes detallados que incluyen recomendaciones específicas, dosis sugeridas y momentos óptimos para tomar cada suplemento.'
    },
    {
      question: '¿Los suplementos recomendados son legales?',
      answer: 'Solo recomendamos suplementos legales y aprobados. Nuestras recomendaciones se basan en productos disponibles en el mercado que cumplen con las regulaciones de seguridad.'
    },
    {
      question: '¿Puedo modificar mi perfil después?',
      answer: 'Sí, puedes editar tu perfil en cualquier momento desde la sección "Mi Perfil". Los cambios se reflejarán en futuras recomendaciones.'
    },
    {
      question: '¿Qué pasa si tengo alergias o condiciones médicas?',
      answer: 'Es crucial que incluyas esta información en tu perfil. Nuestra IA considerará estas limitaciones para evitar recomendaciones que puedan ser perjudiciales para tu salud.'
    },
    {
      question: '¿Cómo contacto con soporte?',
      answer: 'Puedes contactarnos por email en endlessgoalsnutrition@gmail.com o seguirnos en nuestras redes sociales para obtener las últimas actualizaciones y consejos.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-red-700 dark:text-red-300 mb-4">
          {t('Preguntas Frecuentes')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('Encuentra respuestas a las preguntas más comunes sobre EGN Fitness')}
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center" data-aos="fade-up">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
            {t('¿No encuentras tu respuesta?')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('Nuestro equipo está aquí para ayudarte. No dudes en contactarnos.')}
          </p>
          <button 
            onClick={() => setNav('contact')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
          >
            {t('Ir al Formulario de Contacto')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 