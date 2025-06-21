import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  setNav: (nav: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setNav }) => {
  const { t } = useTranslation();

  const handleNavigation = (navKey: string) => {
    setNav(navKey);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContact = (type: string) => {
    switch (type) {
      case 'email':
        window.open('mailto:endlessgoalsnutrition@gmail.com', '_blank');
        break;
      case 'location':
        window.open('https://maps.google.com/?q=Madrid,Spain', '_blank');
        break;
      default:
        break;
    }
  };

  const handleSocialMedia = (platform: string) => {
    const socialLinks = {
      facebook: 'https://facebook.com/endlessgoalsnutrition',
      twitter: 'https://twitter.com/endlessgoalsnutrition',
      instagram: 'https://www.instagram.com/endlessgoalsnutrition?igsh=MWtnbXQzOW05bjJ3NQ=='
    };
    window.open(socialLinks[platform as keyof typeof socialLinks], '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white pt-14 pb-8" data-aos="fade-up">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Navigation */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="font-bold text-lg mb-4 text-red-400">{t('Navegación')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation('home')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Inicio')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('deportes')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Deportes')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('salud')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Salud y Bienestar')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('grasa')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Quema de Grasa')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('mujer')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Específico Mujer')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('cognitivo')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Rendimiento Cognitivo')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="font-bold text-lg mb-4 text-red-400">{t('Servicios')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation('custom')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Personalización')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('reports')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Mis Informes')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('faq')}
                  className="hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  {t('Preguntas Frecuentes')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="font-bold text-lg mb-4 text-red-400">{t('Contacto')}</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('contact')}
                  className="flex items-center hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {t('Formulario de Contacto')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleContact('location')}
                  className="flex items-center hover:text-red-400 transition-colors duration-200 text-left w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Madrid, España
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Logo & Social */}
          <div className="flex flex-col items-start lg:items-end" data-aos="fade-up" data-aos-delay="400">
            <div className="mb-4">
              <span className="text-2xl font-bold text-red-400">EGN</span>
              <p className="text-sm text-gray-400 mt-1">{t('Tu compañero de fitness inteligente')}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSocialMedia('facebook')}
                className="hover:text-red-400 transition-colors duration-200 text-xl"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                onClick={() => handleSocialMedia('twitter')}
                className="hover:text-red-400 transition-colors duration-200 text-xl"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button
                onClick={() => handleSocialMedia('instagram')}
                className="hover:text-red-400 transition-colors duration-200 text-xl"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.472.012-4.686.068-2.61.119-3.832 1.341-3.951 3.951-.056 1.214-.067 1.57-.067 4.686s.011 3.472.067 4.686c.119 2.61 1.341 3.832 3.951 3.951 1.214.056 1.57.067 4.686.067s3.472-.011 4.686-.067c2.61-.119 3.832-1.341 3.951-3.951.056-1.214.067-1.57.067-4.686s-.011-3.472-.067-4.686c-.119-2.61-1.341-3.832-3.951-3.951-1.214-.056-1.57-.067-4.686-.067zm0 4.486c-2.428 0-4.383 1.955-4.383 4.383s1.955 4.383 4.383 4.383 4.383-1.955 4.383-4.383-1.955-4.383-4.383-4.383zm0 7.265c-1.59 0-2.882-1.292-2.882-2.882s1.292-2.882 2.882-2.882 2.882 1.292 2.882 2.882-1.292 2.882-2.882 2.882zm5.187-7.983c-.707 0-1.28.573-1.28 1.28s.573 1.28 1.28 1.28 1.28-.573 1.28-1.28-.573-1.28-1.28-1.28z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500" data-aos="fade-up" data-aos-delay="500">
          <p>&copy; {new Date().getFullYear()} EGN Fitness. {t('Todos los derechos reservados')}.</p>
          <div className="flex justify-center space-x-4 mt-2 text-sm">
            <button 
              onClick={() => handleNavigation('terms')}
              className="hover:text-red-400 transition-colors duration-200"
            >
              {t('Términos de Servicio')}
            </button>
            <button 
              onClick={() => handleNavigation('privacy')}
              className="hover:text-red-400 transition-colors duration-200"
            >
              {t('Política de Privacidad')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 