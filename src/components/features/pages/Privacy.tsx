import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Política de Privacidad - EGN Fitness</title>
        <meta
          name='description'
          content='Política de privacidad de EGN Fitness. Conoce cómo protegemos y utilizamos tu información personal.'
        />
        <meta name='robots' content='index, follow' />
      </Helmet>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-red-700 dark:text-red-300 mb-4'>
            {t('privacy.title')}
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            {t('privacy.lastUpdate', {
              date: new Date().toLocaleDateString(i18n.language),
            })}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8'>
          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section1.title')}
            </h2>
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                  {t('privacy.section1.subtitle1')}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {t('privacy.section1.item1')}
                </p>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {t('privacy.section1.item2')}
                </p>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {t('privacy.section1.item3')}
                </p>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                  {t('privacy.section1.subtitle2')}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {t('privacy.section1.item4')}
                </p>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {t('privacy.section1.item5')}
                </p>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {t('privacy.section1.item6')}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section2.title')}
            </h2>
            <div className='space-y-3'>
              {Object.keys(
                t('privacy.section2.items', { returnObjects: true })
              ).map(key => (
                <p
                  key={key}
                  className='text-gray-600 dark:text-gray-300 leading-relaxed'
                  dangerouslySetInnerHTML={{
                    __html: t(`privacy.section2.items.${key}`),
                  }}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section3.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-4'>
              <strong>{t('privacy.section3.strong')}</strong>
              {t('privacy.section3.text')}
            </p>
            <div className='space-y-3'>
              {Object.keys(
                t('privacy.section3.items', { returnObjects: true })
              ).map(key => (
                <p
                  key={key}
                  className='text-gray-600 dark:text-gray-300 leading-relaxed'
                  dangerouslySetInnerHTML={{
                    __html: t(`privacy.section3.items.${key}`),
                  }}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section4.title')}
            </h2>
            <div className='space-y-4'>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {t('privacy.section4.text')}
              </p>
              <div className='space-y-3'>
                {Object.keys(
                  t('privacy.section4.items', { returnObjects: true })
                ).map(key => (
                  <p
                    key={key}
                    className='text-gray-600 dark:text-gray-300 leading-relaxed'
                    dangerouslySetInnerHTML={{
                      __html: t(`privacy.section4.items.${key}`),
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section5.title')}
            </h2>
            <div className='space-y-3'>
              {Object.keys(
                t('privacy.section5.items', { returnObjects: true })
              ).map(key => (
                <p
                  key={key}
                  className='text-gray-600 dark:text-gray-300 leading-relaxed'
                  dangerouslySetInnerHTML={{
                    __html: t(`privacy.section5.items.${key}`),
                  }}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section6.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('privacy.section6.text')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section7.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('privacy.section7.text')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section8.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('privacy.section8.text')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section9.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('privacy.section9.text')}
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {t('privacy.section10.title')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('privacy.section10.text')}
            </p>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed mt-2'>
              Email: endlessgoalsnutrition@gmail.com
            </p>
          </section>

          <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-8'>
            <h3 className='text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2'>
              {t('privacy.commitment.title')}
            </h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm'>
              {t('privacy.commitment.text')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
