import React, { useRef, useEffect } from 'react';

const SplashScreen: React.FC = () => {
  const logoRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.setAttribute('fetchpriority', 'high');
    }
  }, []);
  return (
    <div
      className='fixed inset-0 w-screen h-screen flex items-center justify-center z-50'
      style={{ backgroundColor: '#0A0A08' }}
      data-aos='fade-in'
      data-testid='splash-screen'
    >
      <picture data-aos='zoom-in' data-aos-delay='200'>
        <source srcSet='/logo-app.webp' type='image/webp' />
        <img
          ref={logoRef}
          src='/logo-app.png'
          alt='EGN'
          className='w-full h-full max-w-xs sm:max-w-sm object-contain'
          width={240}
          height={120}
          loading='eager'
          decoding='async'
        />
      </picture>
    </div>
  );
};

export default SplashScreen;
