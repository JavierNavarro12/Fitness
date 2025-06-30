import React, { startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

interface FAQProps {
  setNav: (nav: string) => void;
}

const FAQ: React.FC<FAQProps> = ({ setNav }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5'),
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6'),
    },
    {
      question: t('faq.q7'),
      answer: t('faq.a7'),
    },
    {
      question: t('faq.q8'),
      answer: t('faq.a8'),
    },
    {
      question: t('faq.q9'),
      answer: t('faq.a9'),
    },
    {
      question: t('faq.q10'),
      answer: t('faq.a10'),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Preguntas Frecuentes - EGN Fitness</title>
        <meta
          name='description'
          content='Resuelve tus dudas sobre EGN Fitness. Preguntas frecuentes sobre suplementación deportiva personalizada con IA.'
        />
        <meta name='robots' content='index, follow' />
      </Helmet>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-red-700 dark:text-red-300 mb-4'>
            {t('faq.title')}
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            {t('faq.subtitle')}
          </p>
        </div>

        <div className='space-y-6'>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'
            >
              <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                {faq.question}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <div className='bg-red-50 dark:bg-red-900/20 rounded-xl p-8'>
            <h3 className='text-2xl font-bold text-red-700 dark:text-red-300 mb-4'>
              {t('faq.notFoundTitle')}
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mb-6'>
              {t('faq.notFoundText')}
            </p>
            <button
              onClick={() => {
                setNav('contact');
                startTransition(() => navigate('/contact'));
              }}
              className='bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200'
            >
              {t('faq.contactButton')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
