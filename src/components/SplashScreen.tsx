import React from 'react';

const SplashScreen: React.FC = () => (
  <div
    className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50"
    style={{ backgroundColor: '#0A0A08' }}
  >
    <img src="/logo-app.png" alt="NutriMind" className="w-full h-full max-w-xs sm:max-w-sm object-contain" />
  </div>
);

export default SplashScreen; 