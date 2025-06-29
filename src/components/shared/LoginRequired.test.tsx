import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginRequired from './LoginRequired';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

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
});
