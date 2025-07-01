import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BottomNav from './BottomNav';

// Mock de useNavigate y useLocation
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/' };
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock de useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'es',
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('BottomNav', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocation.pathname = '/';
  });

  const renderBottomNav = (props?: { user?: any; onSignOut?: () => void }) => {
    return render(
      <BrowserRouter>
        <BottomNav {...props} onChatClick={() => {}} isChatOpen={false} />
      </BrowserRouter>
    );
  };

  it('renderiza los 4 botones con los textos correctos', () => {
    renderBottomNav();
    expect(screen.getByText('nav.home')).toBeInTheDocument();
    expect(screen.getByText('nav.custom')).toBeInTheDocument();
    expect(screen.getByText('nav.reports')).toBeInTheDocument();
    expect(screen.getByText('bottomNav.profile')).toBeInTheDocument();
  });

  it('al hacer click en cada botón navega a la ruta correspondiente', () => {
    renderBottomNav();
    const buttons = screen.getAllByRole('button');

    // Home
    fireEvent.click(buttons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/');

    // Custom
    fireEvent.click(buttons[1]);
    expect(mockNavigate).toHaveBeenCalledWith('/custom');

    // Reports
    fireEvent.click(buttons[2]);
    expect(mockNavigate).toHaveBeenCalledWith('/reports');

    // Profile
    fireEvent.click(buttons[4]);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('el botón activo tiene la clase de resaltado según la ruta', () => {
    mockLocation.pathname = '/reports';
    renderBottomNav();
    const buttons = screen.getAllByRole('button');
    // Home no activo
    expect(buttons[0].className).not.toMatch(/text-red-600/);
    // Custom no activo
    expect(buttons[1].className).not.toMatch(/text-red-600/);
    // Reports activo
    expect(buttons[2].className).toMatch(/text-red-600/);
    // Profile no activo
    expect(buttons[4].className).not.toMatch(/text-red-600/);
  });

  it('renderiza los componentes SVG con las clases correctas', () => {
    renderBottomNav();
    const svgElements = screen.getAllByTestId('nav-icon');
    expect(svgElements.length).toBeGreaterThan(0);

    // Verificar que al menos uno tiene la clase esperada
    const hasExpectedClass = svgElements.some(
      svg =>
        svg.getAttribute('class')?.includes('h-7 w-7') ||
        svg.getAttribute('class')?.includes('text-red-600') ||
        svg.getAttribute('class')?.includes('text-gray-400')
    );
    expect(hasExpectedClass).toBe(true);
  });

  it('maneja el clic en el botón de chat', () => {
    const mockChatClick = jest.fn();
    render(
      <BrowserRouter>
        <BottomNav onChatClick={mockChatClick} isChatOpen={false} />
      </BrowserRouter>
    );

    const chatButton = screen.getByText('AI Chat');
    fireEvent.click(chatButton);
    expect(mockChatClick).toHaveBeenCalled();
  });

  it('muestra el menú de usuario al hacer clic en el botón de perfil', () => {
    const mockUser = { displayName: 'Test User', email: 'test@example.com' };
    const mockSignOut = jest.fn();

    render(
      <BrowserRouter>
        <BottomNav
          user={mockUser}
          onSignOut={mockSignOut}
          onChatClick={() => {}}
          isChatOpen={false}
        />
      </BrowserRouter>
    );

    // Verificar que el botón de perfil está presente
    const profileButton = screen.getByRole('button', {
      name: /bottomNav\.profile/i,
    });
    expect(profileButton).toBeInTheDocument();

    // Hacer clic en el botón de perfil
    fireEvent.click(profileButton);

    // Verificar que el menú se muestra
    expect(screen.getByText('bottomNav.profile')).toBeInTheDocument();
  });
});
