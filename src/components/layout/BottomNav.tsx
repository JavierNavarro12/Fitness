import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { startTransition } from 'react';

// SVG Icons as components
const HomeIcon = ({ className = '' }) => (
  <svg
    data-testid='nav-icon'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' />
  </svg>
);
const CogIcon = ({ className = '' }) => (
  <svg
    data-testid='nav-icon'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d='M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z' />
  </svg>
);
const ClipboardListIcon = ({ className = '' }) => (
  <svg
    data-testid='nav-icon'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d='M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM12 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V5h2v2h10V5h2v16zM7 9h10v2H7zm0 4h10v2H7zm0 4h7v2H7z' />
  </svg>
);
const UserIcon = ({ className = '' }) => (
  <svg
    data-testid='nav-icon'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
  </svg>
);

const ChatIcon = ({ className = '' }) => (
  <svg
    data-testid='nav-icon'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z' />
  </svg>
);

interface BottomNavProps {
  user?: any;
  onSignOut?: () => void;
  onChatClick?: () => void;
  isChatOpen?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({
  user,
  onSignOut,
  onChatClick,
  isChatOpen,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { key: 'home', label: t('nav.home'), icon: HomeIcon, path: '/' },
    { key: 'custom', label: t('nav.custom'), icon: CogIcon, path: '/custom' },
    {
      key: 'reports',
      label: t('nav.reports'),
      icon: ClipboardListIcon,
      path: '/reports',
    },
    {
      key: 'chat',
      label: 'AI Chat',
      icon: ChatIcon,
      path: '/ai-chat',
      onClick: onChatClick,
      isActive: isChatOpen,
    },
    {
      key: 'profile',
      label: t('bottomNav.profile'),
      path: '/profile',
      customIcon: user?.photoURL ? (
        <div className='w-7 h-7 rounded-full overflow-hidden'>
          <img
            src={user.photoURL}
            alt='Profile'
            className='w-full h-full object-cover'
          />
        </div>
      ) : (
        <UserIcon className='h-7 w-7' />
      ),
    },
  ];

  return (
    <nav className='fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-evenly items-center py-2 z-50 sm:hidden shadow-t h-20'>
      {navItems.map(item => {
        const isActive =
          item.isActive !== undefined
            ? item.isActive
            : item.path === '/'
              ? location.pathname === '/'
              : item.path
                ? location.pathname.startsWith(item.path)
                : false;
        return (
          <button
            key={item.key}
            onClick={() =>
              item.onClick
                ? item.onClick()
                : item.path && startTransition(() => navigate(item.path))
            }
            className={`flex flex-col items-center justify-center flex-1 mx-1 py-1.5 focus:outline-none transition-colors ${isActive ? 'text-red-600 font-semibold' : 'text-gray-500 dark:text-gray-300'}`}
          >
            {item.customIcon ? (
              <div
                className={`mb-1.5 transition-colors ${isActive ? 'ring-2 ring-red-600 rounded-full' : ''}`}
              >
                {item.customIcon}
              </div>
            ) : (
              item.icon && (
                <item.icon
                  className={`h-7 w-7 mb-1.5 transition-colors ${isActive ? 'text-red-600' : 'text-gray-400 dark:text-gray-400'}`}
                />
              )
            )}
            <span className='text-sm font-medium'>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
