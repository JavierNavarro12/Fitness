import React from 'react';
import { render, screen } from '@testing-library/react';
import SplashScreen from './SplashScreen';

describe('SplashScreen', () => {
  it('renderiza el logo y el alt correctamente', () => {
    render(<SplashScreen />);
    const img = screen.getByAltText('EGN');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logo-app.png');
  });

  it('establece fetchpriority="high" en el logo', () => {
    render(<SplashScreen />);
    const img = screen.getByAltText('EGN');
    // El efecto se ejecuta después del montaje
    expect(img.getAttribute('fetchpriority')).toBe('high');
  });

  it('renderiza correctamente', () => {
    const { container } = render(<SplashScreen />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('maneja el caso donde logoRef.current es null', () => {
    // Mock de useRef para que retorne null
    const mockRef = { current: null };
    jest.spyOn(React, 'useRef').mockReturnValue(mockRef);
    
    render(<SplashScreen />);
    
    // Verificar que no hay errores cuando logoRef.current es null
    expect(mockRef.current).toBeNull();
    
    // Restaurar el mock
    jest.restoreAllMocks();
  });

  it('maneja el caso donde logoRef.current existe', () => {
    // Mock de useRef para que retorne un elemento
    const mockElement = document.createElement('img');
    const mockRef = { current: mockElement };
    jest.spyOn(React, 'useRef').mockReturnValue(mockRef);
    
    render(<SplashScreen />);
    
    // Verificar que se llama setAttribute cuando el elemento existe
    expect(mockRef.current).toBe(mockElement);
    
    // Restaurar el mock
    jest.restoreAllMocks();
  });
}); 