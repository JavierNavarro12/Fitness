import React from 'react';

const SplashScreen: React.FC = () => (
  <div
    className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50"
    style={{ backgroundColor: '#0A0A08' }}
    data-aos="fade-in"
  >
    <picture data-aos="zoom-in" data-aos-delay="200">
      <source srcSet="/logo-app.webp" type="image/webp" />
      <img src="/logo-app.png" alt="EGN" className="w-full h-full max-w-xs sm:max-w-sm object-contain" loading="eager" />
    </picture>
  </div>
);

export default SplashScreen; 