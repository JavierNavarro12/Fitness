import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';

export const handleNavigation = (
  navKey: string,
  navigate: (path: string) => void
) => {
  const routes: Record<string, string> = {
    home: '/',
    deportes: '/deportes',
    salud: '/salud',
    grasa: '/grasa',
    mujer: '/mujer',
    cognitivo: '/cognitivo',
    custom: '/custom',
    reports: '/reports',
    faq: '/faq',
    terms: '/terms',
    privacy: '/privacy',
    contact: '/contact',
  };
  startTransition(() => navigate(routes[navKey] || '/'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const handleContact = (type: string) => {
  switch (type) {
    case 'email':
      window.open('mailto:endlessgoalsnutrition@gmail.com', '_blank');
      break;
    case 'location':
      window.open('https://maps.google.com/?q=Granada,Spain', '_blank');
      break;
    default:
      break;
  }
};

export const handleSocialMedia = (platform: string) => {
  const socialLinks = {
    tiktok:
      'https://www.tiktok.com/@endlessgoalsnutrition?_t=ZN-8xRPG4v5Il4&_r=1',
    twitter: 'https://x.com/endlessgoalsn?s=21',
    instagram:
      'https://www.instagram.com/endlessgoalsnutrition?igsh=MWtnbXQzOW05bjJ3NQ==',
  };
  if (socialLinks[platform as keyof typeof socialLinks]) {
    window.open(socialLinks[platform as keyof typeof socialLinks], '_blank');
  }
};

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isHome =
    typeof window !== 'undefined' && window.location.pathname === '/';

  React.useEffect(() => {
    if (isHome) {
      // Forzamos visibilidad de todos los elementos que tengan data-aos
      const nodes = document.querySelectorAll('footer [data-aos]');
      nodes.forEach(node => node.classList.add('aos-animate'));
    }
  }, [isHome]);

  return (
    <footer
      className='hidden sm:block bg-gray-900 text-white pt-14 pb-8 aos-animate'
      data-aos={isHome ? undefined : 'fade-up'}
    >
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Column 1: Navigation */}
          <div data-aos='fade-up' data-aos-delay='100'>
            <h3 className='font-bold text-lg mb-4 text-red-400'>
              {t('footer.nav.title')}
            </h3>
            <ul className='space-y-2'>
              <li>
                <button
                  onClick={() => handleNavigation('home', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('deportes', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.nav.deportes')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('salud', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.nav.salud')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('grasa', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.nav.grasa')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('mujer', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.nav.mujer')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('cognitivo', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.nav.cognitivo')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div data-aos='fade-up' data-aos-delay='200'>
            <h3 className='font-bold text-lg mb-4 text-red-400'>
              {t('footer.services.title')}
            </h3>
            <ul className='space-y-2'>
              <li>
                <button
                  onClick={() => handleNavigation('custom', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.services.custom')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('reports', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.services.reports')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('faq', navigate)}
                  className='hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  {t('footer.services.faq')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div data-aos='fade-up' data-aos-delay='300'>
            <h3 className='font-bold text-lg mb-4 text-red-400'>
              {t('footer.contact.title')}
            </h3>
            <ul className='space-y-3'>
              <li>
                <button
                  onClick={() => startTransition(() => navigate('/contact'))}
                  className='flex items-center hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
                  {t('footer.contact.form')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleContact('location')}
                  className='flex items-center hover:text-red-400 transition-colors duration-200 text-left w-full'
                >
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {t('footer.contact.location')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Logo & Social */}
          <div
            className='flex flex-col items-start lg:items-end'
            data-aos='fade-up'
            data-aos-delay='400'
          >
            <div className='mb-4'>
              <span className='text-2xl font-bold text-red-400'>EGN</span>
              <p className='text-sm text-gray-400 mt-1'>
                {t('footer.tagline')}
              </p>
            </div>
            <div className='flex space-x-4'>
              <button
                onClick={() => handleSocialMedia('tiktok')}
                className='hover:text-red-400 transition-colors duration-200 text-xl'
                aria-label='TikTok'
              >
                <svg
                  className='w-6 h-6'
                  viewBox='0 0 48 48'
                  fill='currentColor'
                >
                  <g transform='translate(0, -2)'>
                    <path d='M41,16.5c-3.6,0-6.5-2.9-6.5-6.5h-5.2v24.2c0,3.2-2.6,5.8-5.8,5.8s-5.8-2.6-5.8-5.8s2.6-5.8,5.8-5.8c0.5,0,1,0.1,1.5,0.2v-5.3 c-0.5-0.1-1-0.1-1.5-0.1c-6.1,0-11,4.9-11,11s4.9,11,11,11s11-4.9,11-11V22.1c1.9,1.1,4.1,1.7,6.5,1.7V16.5z' />
                  </g>
                </svg>
              </button>
              <button
                onClick={() => handleSocialMedia('twitter')}
                className='hover:text-red-400 transition-colors duration-200 text-xl'
                aria-label='Twitter'
              >
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <g transform='scale(0.85) translate(2,4)'>
                    <path d='M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.01-4.52 4.5 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.6 1.64.9c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65A4.48 4.48 0 01.96 5.1v.06c0 2.13 1.52 3.9 3.56 4.3-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.56 1.7 2.18 2.94 4.1 2.97A9.05 9.05 0 010 19.54a12.8 12.8 0 006.95 2.03c8.34 0 12.9-6.92 12.9-12.92 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z' />
                  </g>
                </svg>
              </button>
              <button
                onClick={() => handleSocialMedia('instagram')}
                className='hover:text-red-400 transition-colors duration-200 text-xl'
                aria-label='Instagram'
              >
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <g>
                    <path d='M12 2.2c3.2 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.314.975.975 1.252 2.242 1.314 3.608.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.314 3.608-.975.975-2.242 1.252-3.608 1.314-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.314-.975-.975-1.252-2.242-1.314-3.608C2.212 15.634 2.2 15.25 2.2 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.314-3.608C4.56 2.61 5.827 2.333 7.193 2.27 8.459 2.212 8.843 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.52.41 3.545 1.384 2.57 2.36 2.288 3.61 2.23 4.892 2.172 6.172 2.16 6.576 2.16 12c0 5.424.012 5.828.07 7.108.058 1.282.34 2.532 1.315 3.507.975.975 2.225 1.257 3.507 1.315C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.282-.058 2.532-.34 3.507-1.315.975-.975 1.257-2.225 1.315-3.507.058-1.28.07-1.684.07-7.108 0-5.424-.012-5.828-.07-7.108-.058-1.282-.34-2.532-1.315-3.507C19.48.41 18.23.128 16.948.07 15.668.012 15.264 0 12 0zm0 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z' />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className='border-t border-gray-800 mt-10 pt-6 text-center text-gray-500'
          data-aos='fade-up'
          data-aos-delay='500'
        >
          <p>
            &copy; {new Date().getFullYear()} EGN Fitness.{' '}
            {t('footer.copyright')}.
          </p>
          <div className='flex justify-center space-x-4 mt-2 text-sm'>
            <button
              onClick={() => handleNavigation('terms', navigate)}
              className='hover:text-red-400 transition-colors duration-200'
            >
              {t('footer.legal.terms')}
            </button>
            <button
              onClick={() => handleNavigation('privacy', navigate)}
              className='hover:text-red-400 transition-colors duration-200'
            >
              {t('footer.legal.privacy')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
