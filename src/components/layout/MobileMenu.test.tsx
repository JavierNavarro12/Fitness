import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
});

export {}; 