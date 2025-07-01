import React from 'react';
import { useTranslation } from 'react-i18next';
import Switch from '../shared/Switch';
import LanguageSwitch from '../shared/LanguageSwitch';

// Define the type for a menu item
interface MenuItem {
  key: string;
  label: string;
  nav: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (nav: string) => void;
  menuItems: MenuItem[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
  i18n: {
    language: string;
    changeLanguage: (lang: string) => void;
  };
  showLoginButton?: boolean;
  onLoginClick?: () => void;
}

const CloseIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
);

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  menuItems,
  darkMode,
  onToggleDarkMode,
  i18n,
  showLoginButton,
  onLoginClick,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-0 right-0 bottom-20 bg-white dark:bg-gray-900 z-40 flex flex-col sm:hidden animate-fade-in'>
      <div className='flex justify-end p-4 h-14 items-center'>
        <button onClick={onClose} className='text-gray-600 dark:text-gray-300'>
          <CloseIcon className='h-8 w-8' />
        </button>
      </div>
      <nav className='flex-1 flex flex-col p-8 justify-between'>
        <ul className='flex flex-col gap-2 mt-8'>
          {menuItems.map((item, idx) => (
            <React.Fragment key={item.key}>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl text-2xl font-semibold transition-colors duration-200 ${item.key === 'blog' ? 'text-red-600' : 'text-gray-800 dark:text-gray-100'} hover:bg-red-100 dark:hover:bg-gray-800`}
                  onClick={() => {
                    onNavigate(item.nav);
                    onClose();
                  }}
                >
                  {t(item.label)}
                </button>
              </li>
              {item.key === 'cognitivo' &&
                menuItems.some(mi => mi.key === 'blog') && (
                  <li aria-hidden='true'>
                    <div className='my-2 border-t border-gray-200 dark:border-gray-700 w-full' />
                  </li>
                )}
            </React.Fragment>
          ))}
        </ul>
        {showLoginButton && (
          <button
            className='mt-8 w-full py-3 rounded-lg bg-red-600 text-white text-xl font-bold shadow hover:bg-red-700 transition-colors'
            onClick={() => {
              onLoginClick?.();
              onClose();
            }}
          >
            {t('loginRequired.loginButton')}
          </button>
        )}
        <div className='flex flex-row gap-4 justify-end items-center py-4 border-t border-gray-200 dark:border-gray-700'>
          <div style={{ transform: 'scale(0.9)' }}>
            <LanguageSwitch
              checked={i18n.language === 'en'}
              onChange={() => {
                const newLang = i18n.language === 'es' ? 'en' : 'es';
                i18n.changeLanguage(newLang);
                localStorage.setItem('lang', newLang);
              }}
            />
          </div>
          <div style={{ transform: 'scale(0.9)' }}>
            <Switch checked={darkMode} onChange={onToggleDarkMode} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
