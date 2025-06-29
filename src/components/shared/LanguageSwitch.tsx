import React from 'react';

interface LanguageSwitchProps {
  checked: boolean; // true = EN, false = ES
  onChange: () => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ checked, onChange }) => {
  return (
    <label
      htmlFor="language-toggle"
      className="relative flex items-center w-20 h-10 cursor-pointer"
    >
      <input
        id="language-toggle"
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        data-testid="language-switch"
      />
      {/* Background */}
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full" />
      
      {/* Sliding Circle */}
      <div
        className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
          checked ? 'translate-x-10' : ''
        }`}
      />
      
      {/* Text Labels */}
      <div className="absolute inset-0 flex justify-around items-center">
        <span className={`text-sm font-bold transition-colors ${!checked ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>ES</span>
        <span className={`text-sm font-bold transition-colors ${checked ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>EN</span>
      </div>
    </label>
  );
};

export default LanguageSwitch; 