import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const encode = (data: { [key: string]: any }) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('sending');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', ...formData }),
    })
      .then(() => {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmissionStatus('idle'), 4000);
      })
      .catch((error) => {
        setSubmissionStatus('error');
        console.error(error);
        setTimeout(() => setSubmissionStatus('idle'), 4000);
      });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-red-700 dark:text-red-300 mb-4">
          {t('Contacta con Nosotros')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('¿Tienes alguna duda o sugerencia? Rellena el formulario y te responderemos lo antes posible.')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8" data-aos="fade-up" data-aos-delay="200">
        <form 
          name="contact" 
          method="POST" 
          data-netlify="true" 
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
        >
          {/* Campo oculto para Netlify */}
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </p>

          <div className="space-y-6">
            <div className="relative">
              <label htmlFor="name" className="sr-only">{t('Nombre')}</label>
              <svg className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder={t('Tu Nombre')}
                required 
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="sr-only">{t('Correo electrónico')}</label>
              <svg className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder={t('Tu Correo Electrónico')}
                required 
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="relative">
              <label htmlFor="message" className="sr-only">{t('Mensaje')}</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder={t('Escribe tu mensaje aquí...')}
                required 
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              type="submit" 
              disabled={submissionStatus === 'sending'}
              className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-400"
            >
              {submissionStatus === 'sending' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('Enviando...')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  {t('Enviar Mensaje')}
                </>
              )}
            </button>
          </div>
          
          {submissionStatus === 'success' && (
            <p className="mt-4 text-center text-green-500 font-semibold animate-fade-in">
              {t('¡Mensaje enviado con éxito! Gracias por contactarnos.')}
            </p>
          )}
          {submissionStatus === 'error' && (
            <p className="mt-4 text-center text-red-500 font-semibold animate-fade-in">
              {t('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.')}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact; 