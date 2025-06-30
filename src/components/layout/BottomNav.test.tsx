import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BottomNav from './BottomNav';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: jest.fn(),
  };
});

// Mock de useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('BottomNav', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithPath = (pathname: string, props?: { user?: any; onSignOut?: () => void }) => {
    // Mock useLocation para cada test
    (require('react-router-dom').useLocation as jest.Mock).mockReturnValue({ pathname });
    return render(
      <MemoryRouter>
        <BottomNav {...props} />
      </MemoryRouter>
    );
  };

  it('renderiza los 4 botones con los textos correctos', () => {
    renderWithPath('/');
    expect(screen.getByText('nav.home')).toBeInTheDocument();
    expect(screen.getByText('nav.custom')).toBeInTheDocument();
    expect(screen.getByText('nav.reports')).toBeInTheDocument();
    expect(screen.getByText('bottomNav.profile')).toBeInTheDocument();
  });

  it('al hacer click en cada botón navega a la ruta correspondiente', () => {
    renderWithPath('/');
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // Home
    expect(mockNavigate).toHaveBeenCalledWith('/');
    fireEvent.click(buttons[1]); // Custom
    expect(mockNavigate).toHaveBeenCalledWith('/custom');
    fireEvent.click(buttons[2]); // Reports
    expect(mockNavigate).toHaveBeenCalledWith('/reports');
    fireEvent.click(buttons[3]); // Profile
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('el botón activo tiene la clase de resaltado según la ruta', () => {
    renderWithPath('/reports');
    const buttons = screen.getAllByRole('button');
    // Home no activo
    expect(buttons[0].className).not.toMatch(/text-red-600/);
    // Custom no activo
    expect(buttons[1].className).not.toMatch(/text-red-600/);
    // Reports activo
    expect(buttons[2].className).toMatch(/text-red-600/);
    // Profile no activo
    expect(buttons[3].className).not.toMatch(/text-red-600/);
  });

  it('maneja el caso donde item.path no es / y location.pathname no empieza con item.path', () => {
    renderWithPath('/other-page');

    const customButton = screen.getByText('nav.custom');
    fireEvent.click(customButton);

    expect(mockNavigate).toHaveBeenCalledWith('/custom');
  });

  it('maneja el caso donde item.path es / y location.pathname es /', () => {
    renderWithPath('/');

    const homeButton = screen.getByText('nav.home');
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('maneja el caso donde item.path es / pero location.pathname no es /', () => {
    renderWithPath('/custom');

    const homeButton = screen.getByText('nav.home');
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('maneja el caso donde item.path no es / y location.pathname empieza con item.path', () => {
    renderWithPath('/custom/settings');

    const customButton = screen.getByText('nav.custom');
    fireEvent.click(customButton);

    expect(mockNavigate).toHaveBeenCalledWith('/custom');
  });

  it('renderiza los componentes SVG con className opcional', () => {
    renderWithPath('/');

    // Verificar que los SVG se renderizan con las clases correctas
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
    
    // Verificar que al menos uno tiene la clase esperada
    const hasExpectedClass = Array.from(svgElements).some(svg => 
      svg.getAttribute('class')?.includes('h-7 w-7') || 
      svg.getAttribute('class')?.includes('text-red-600') || 
      svg.getAttribute('class')?.includes('text-gray-400')
    );
    expect(hasExpectedClass).toBe(true);
  });

  it('maneja props opcionales user y onSignOut', () => {
    const mockOnSignOut = jest.fn();
    const user = { displayName: 'Test User' };

    renderWithPath('/', { user, onSignOut: mockOnSignOut });

    // Verificar que el componente se renderiza sin errores con props opcionales
    expect(screen.getByText('nav.home')).toBeInTheDocument();
    expect(screen.getByText('nav.custom')).toBeInTheDocument();
    expect(screen.getByText('nav.reports')).toBeInTheDocument();
    expect(screen.getByText('bottomNav.profile')).toBeInTheDocument();
  });
}); 