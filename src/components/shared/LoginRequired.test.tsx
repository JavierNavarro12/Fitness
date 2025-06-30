import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginRequired from './LoginRequired';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

// Mock useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    useLocation: () => ({}),
  };
});

describe('LoginRequired', () => {
  it('renders title, message, button and section name', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LoginRequired sectionName='Deportes' />
        </MemoryRouter>
      </I18nextProvider>
    );
    // Verifica el título real
    expect(screen.getByText(/Acceso Restringido/i)).toBeInTheDocument();
    // Verifica el mensaje principal real
    expect(
      screen.getByText(/Debes iniciar sesión para acceder a/i)
    ).toBeInTheDocument();
    // Verifica el botón real
    expect(
      screen.getByRole('button', { name: /Iniciar Sesión/i })
    ).toBeInTheDocument();
    // Verifica el nombre de la sección
    expect(screen.getByText(/Deportes/i)).toBeInTheDocument();
  });

  it('calls navigate when clicking the login button', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LoginRequired sectionName='TestSeccion' />
        </MemoryRouter>
      </I18nextProvider>
    );
    const button = screen.getByRole('button', { name: /Iniciar Sesión/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalled();
  });
});
 