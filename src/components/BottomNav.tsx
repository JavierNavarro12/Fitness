import React from 'react';
import { FaHome, FaUser, FaClipboardList, FaCog } from 'react-icons/fa';

interface BottomNavProps {
  nav: string;
  setNav: (nav: string) => void;
  user?: any;
  onSignOut?: () => void;
}

const navItems = [
  { key: 'home', label: 'Inicio', icon: FaHome },
  { key: 'custom', label: 'Personalizar', icon: FaCog },
  { key: 'reports', label: 'Informes', icon: FaClipboardList },
  { key: 'profile', label: 'Perfil', icon: FaUser },
];

const BottomNav: React.FC<BottomNavProps> = ({ nav, setNav }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-3 z-50 sm:hidden shadow-t h-20">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = nav === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setNav(item.key)}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-2 focus:outline-none transition text-base ${isActive ? 'text-red-600 font-bold' : 'text-gray-500 dark:text-gray-300'}`}
          >
            {Icon({ className: `text-2xl mb-1 ${isActive ? 'text-red-600' : 'text-gray-400 dark:text-gray-400'}` })}
            <span className="text-[13px] leading-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav; 