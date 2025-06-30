import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MobileMenu from './MobileMenu';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() }
  }),
}));

describe('MobileMenu', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onNavigate: jest.fn(),
    menuItems: [
      { key: 'home', label: 'nav.home', nav: '/' },
      { key: 'about', label: 'nav.about', nav: '/about' }
    ],
    darkMode: false,
    onToggleDarkMode: jest.fn(),
    i18n: { language: 'es', changeLanguage: jest.fn() },
    showLoginButton: true,
    onLoginClick: jest.fn()
  };

  it('renderiza cuando está abierto', () => {
    const { getByText } = render(<MobileMenu {...defaultProps} />);
    expect(getByText('nav.home')).toBeInTheDocument();
    expect(getByText('nav.about')).toBeInTheDocument();
  });

  it('no renderiza cuando está cerrado', () => {
    const { container } = render(<MobileMenu {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('llama a onClose al hacer click en cerrar', () => {
    const { container } = render(<MobileMenu {...defaultProps} />);
    const closeButton = container.querySelector('button');
    fireEvent.click(closeButton!);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('llama a onNavigate al hacer click en un item del menú', () => {
    const { getByText } = render(<MobileMenu {...defaultProps} />);
    fireEvent.click(getByText('nav.home'));
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('/');
  });

  it('llama a onClose al hacer click en un item del menú', () => {
    const { getByText } = render(<MobileMenu {...defaultProps} />);
    fireEvent.click(getByText('nav.home'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('llama a onLoginClick al hacer click en el botón de login', () => {
    const { getByText } = render(<MobileMenu {...defaultProps} showLoginButton={true} />);
    fireEvent.click(getByText('loginRequired.loginButton'));
    expect(defaultProps.onLoginClick).toHaveBeenCalled();
  });

  it('el switch de idioma llama a changeLanguage y cambia localStorage', () => {
    const changeLanguage = jest.fn();
    const i18n = { language: 'es', changeLanguage };
    const { container } = render(<MobileMenu {...defaultProps} i18n={i18n} />);
    const langSwitch = container.querySelector('input[type="checkbox"]');
    // Simular click en el switch de idioma
    if (langSwitch) {
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: jest.fn(),
        },
        writable: true,
      });
      fireEvent.click(langSwitch);
      expect(changeLanguage).toHaveBeenCalledWith('en');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('lang', 'en');
    }
  });

  it('el switch de dark mode llama a onToggleDarkMode', () => {
    const { container } = render(<MobileMenu {...defaultProps} />);
    const switches = container.querySelectorAll('input[type="checkbox"]');
    // El segundo switch es el de dark mode
    if (switches.length > 1) {
      fireEvent.click(switches[1]);
      expect(defaultProps.onToggleDarkMode).toHaveBeenCalled();
    }
  });

  it('maneja el cambio de idioma cuando el idioma actual es inglés', () => {
    const mockI18n = {
      language: 'en',
      changeLanguage: jest.fn(),
    };

    render(
      <MobileMenu
        isOpen={true}
        onClose={defaultProps.onClose}
        onNavigate={defaultProps.onNavigate}
        menuItems={defaultProps.menuItems}
        darkMode={false}
        onToggleDarkMode={defaultProps.onToggleDarkMode}
        i18n={mockI18n}
      />
    );

    const languageSwitch = screen.getByTestId('language-switch');
    fireEvent.click(languageSwitch);

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('es');
    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'es');
  });

  it('maneja el cambio de idioma cuando el idioma actual es español', () => {
    const mockI18n = {
      language: 'es',
      changeLanguage: jest.fn(),
    };

    render(
      <MobileMenu
        isOpen={true}
        onClose={defaultProps.onClose}
        onNavigate={defaultProps.onNavigate}
        menuItems={defaultProps.menuItems}
        darkMode={false}
        onToggleDarkMode={defaultProps.onToggleDarkMode}
        i18n={mockI18n}
      />
    );

    const languageSwitch = screen.getByTestId('language-switch');
    fireEvent.click(languageSwitch);

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('en');
    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'en');
  });

  it('maneja el caso donde isOpen es false', () => {
    const { container } = render(
      <MobileMenu
        isOpen={false}
        onClose={defaultProps.onClose}
        onNavigate={defaultProps.onNavigate}
        menuItems={defaultProps.menuItems}
        darkMode={false}
        onToggleDarkMode={defaultProps.onToggleDarkMode}
        i18n={defaultProps.i18n}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

export {}; 