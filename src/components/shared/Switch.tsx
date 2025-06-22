import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

interface SwitchProps {
  checked: boolean; // true = dark, false = light
  onChange: () => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <label
      htmlFor="theme-toggle"
      className="relative flex items-center w-20 h-10 cursor-pointer"
    >
      <input
        id="theme-toggle"
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      {/* Background */}
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full" />
      
      {/* Sliding Circle */}
      <div
        className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
          checked ? 'translate-x-10' : ''
        }`}
      />
      
      {/* Icons */}
      <div className="absolute inset-0 flex justify-around items-center">
        {FaSun({ className: `transition-colors ${!checked ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'}` })}
        {FaMoon({ className: `transition-colors ${checked ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}` })}
      </div>
    </label>
  );
};

export default Switch; 