import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from './HomePage';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { HelmetProvider } from 'react-helmet-async';

describe('HomePage', () => {
  it('renderiza el título principal', () => {
    render(
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <HomePage onStart={jest.fn()} />
        </I18nextProvider>
      </HelmetProvider>
    );
    expect(screen.getByText(/Bienvenido a EGN/i)).toBeInTheDocument();
  });

  it('llama a onStart al hacer clic en el botón principal', () => {
    const onStartMock = jest.fn();
    render(
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <HomePage onStart={onStartMock} />
        </I18nextProvider>
      </HelmetProvider>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onStartMock).toHaveBeenCalled();
  });

  // Puedes agregar más tests según el contenido de la página
  // it('muestra el botón de empezar', () => {
  //   expect(screen.getByRole('button', { name: /empezar/i })).toBeInTheDocument();
  // });
});
