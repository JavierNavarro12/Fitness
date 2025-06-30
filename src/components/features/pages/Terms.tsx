import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Términos de Servicio - EGN Fitness</title>
        <meta
          name='description'
          content='Términos y condiciones de uso de EGN Fitness. Conoce nuestras políticas de uso responsable, limitaciones de responsabilidad y más.'
        />
        <meta name='robots' content='index, follow' />
      </Helmet>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-red-700 dark:text-red-300 mb-4'>
            {t('terms.title')}
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            {t('terms.lastUpdate', {
              date: new Date().toLocaleDateString(i18n.language),
            })}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8'>
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('terms.section1.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('terms.section1.text')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('terms.section2.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-4'>
              {t('terms.section2.text')}
            </p>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              <strong>Importante:</strong> {t('terms.section2.important')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('terms.section3.title')}
            </h2>
            <div className='space-y-3'>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('terms.section3.item1')}
              </p>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('terms.section3.item2')}
              </p>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('terms.section3.item3')}
              </p>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('terms.section3.item4')}
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('terms.section4.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-4'>
              {t('terms.section4.text')}
            </p>
            <div className='space-y-3'>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('terms.section4.item1')}
              </p>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('terms.section4.item2')}
              </p>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('terms.section4.item3')}
              </p>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('terms.section4.item4')}
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('terms.section5.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('terms.section5.text')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('terms.section6.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('terms.section6.text')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('terms.section7.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('terms.section7.text')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('terms.section8.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('terms.section8.text')}
            </p>
          </section>

          <div className='bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mt-8'>
            <h3 className='text-lg font-semibold text-red-700 dark:text-red-300 mb-2'>
              {t('terms.legalNoticeTitle')}
            </h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm'>
              {t('terms.legalNoticeText')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
