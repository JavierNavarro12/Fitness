import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';

import Contact from './Contact';

// Mock de useTranslation
const mockT = jest.fn(key => {
  if (key === 'Tu Nombre') return 'Tu Nombre';
  if (key === 'Tu Correo Electrónico') return 'Tu Correo Electrónico';
  if (key === 'Escribe tu mensaje aquí...') return 'Escribe tu mensaje aquí...';
  if (key === 'Contacta con Nosotros') return 'Contacta con Nosotros';
  if (key === 'Enviar Mensaje') return 'Enviar Mensaje';
  if (key === 'Enviando...') return 'Enviando...';
  if (key === '¡Mensaje enviado con éxito! Gracias por contactarnos.')
    return '¡Mensaje enviado con éxito! Gracias por contactarnos.';
  if (
    key === 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.'
  )
    return 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
  return key;
});
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

// Mock de fetch
global.fetch = jest.fn();

// Mock de setTimeout
jest.useFakeTimers();

describe('Contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renderiza el formulario correctamente', () => {
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = screen.getByTestId('name');
    if (!nameInput) throw new Error('No se encontró el input de nombre');
    const emailInput = screen.getByTestId('email');
    if (!emailInput) throw new Error('No se encontró el input de correo');
    const messageInput = screen.getByTestId('message');
    if (!messageInput) throw new Error('No se encontró el input de mensaje');
    expect(screen.getByTestId('submit')).toBeInTheDocument();
  });

  it('maneja cambios en los campos del formulario', () => {
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = screen.getByTestId('name');
    if (!nameInput) throw new Error('No se encontró el input de nombre');
    const emailInput = screen.getByTestId('email');
    if (!emailInput) throw new Error('No se encontró el input de correo');
    const messageInput = screen.getByTestId('message');
    if (!messageInput) throw new Error('No se encontró el input de mensaje');

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'Hola, tengo una pregunta' },
    });

    expect((nameInput as HTMLInputElement).value).toBe('Juan Pérez');
    expect((emailInput as HTMLInputElement).value).toBe('juan@example.com');
    expect((messageInput as HTMLTextAreaElement).value).toBe(
      'Hola, tengo una pregunta'
    );
  });

  it('maneja envío exitoso del formulario', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = screen.getByTestId('name');
    if (!nameInput) throw new Error('No se encontró el input de nombre');
    const emailInput = screen.getByTestId('email');
    if (!emailInput) throw new Error('No se encontró el input de correo');
    const messageInput = screen.getByTestId('message');
    if (!messageInput) throw new Error('No se encontró el input de mensaje');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'Hola, tengo una pregunta' },
    });

    fireEvent.click(submitButton);

    // El botón debe estar deshabilitado durante el envío
    expect(submitButton).toBeDisabled();

    // Esperar a que se complete el envío
    await waitFor(() => {
      expect((nameInput as HTMLInputElement).value).toBe('');
    });
    await waitFor(() => {
      expect((emailInput as HTMLInputElement).value).toBe('');
    });
    await waitFor(() => {
      expect((messageInput as HTMLTextAreaElement).value).toBe('');
    });

    expect(global.fetch).toHaveBeenCalledWith('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'form-name=contact&name=Juan%20P%C3%A9rez&email=juan%40example.com&message=Hola%2C%20tengo%20una%20pregunta',
    });

    jest.advanceTimersByTime(4000);
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('maneja error en el envío del formulario', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = screen.getByTestId('name');
    if (!nameInput) throw new Error('No se encontró el input de nombre');
    const emailInput = screen.getByTestId('email');
    if (!emailInput) throw new Error('No se encontró el input de correo');
    const messageInput = screen.getByTestId('message');
    if (!messageInput) throw new Error('No se encontró el input de mensaje');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'Hola, tengo una pregunta' },
    });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    jest.advanceTimersByTime(4000);
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('previene envío múltiple mientras está enviando', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = screen.getByTestId('name');
    if (!nameInput) throw new Error('No se encontró el input de nombre');
    const emailInput = screen.getByTestId('email');
    if (!emailInput) throw new Error('No se encontró el input de correo');
    const messageInput = screen.getByTestId('message');
    if (!messageInput) throw new Error('No se encontró el input de mensaje');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'Hola, tengo una pregunta' },
    });

    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('codifica correctamente los datos del formulario', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = screen.getByTestId('name');
    if (!nameInput) throw new Error('No se encontró el input de nombre');
    const emailInput = screen.getByTestId('email');
    if (!emailInput) throw new Error('No se encontró el input de correo');
    const messageInput = screen.getByTestId('message');
    if (!messageInput) throw new Error('No se encontró el input de mensaje');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(nameInput, { target: { value: 'María José' } });
    fireEvent.change(emailInput, { target: { value: 'maria@test.com' } });
    fireEvent.change(messageInput, {
      target: { value: '¿Cómo estás? & gracias!' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'form-name=contact&name=Mar%C3%ADa%20Jos%C3%A9&email=maria%40test.com&message=%C2%BFC%C3%B3mo%20est%C3%A1s%3F%20%26%20gracias!',
      });
    });
  });

  it('maneja campos vacíos correctamente', () => {
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = screen.getByTestId('name');
    if (!nameInput) throw new Error('No se encontró el input de nombre');
    const emailInput = screen.getByTestId('email');
    if (!emailInput) throw new Error('No se encontró el input de correo');
    const messageInput = screen.getByTestId('message');
    if (!messageInput) throw new Error('No se encontró el input de mensaje');

    expect((nameInput as HTMLInputElement).value).toBe('');
    expect((emailInput as HTMLInputElement).value).toBe('');
    expect((messageInput as HTMLTextAreaElement).value).toBe('');

    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(messageInput).toHaveAttribute('required');
  });

  it('maneja diferentes tipos de entrada', () => {
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = screen.getByTestId('name');
    if (!nameInput) throw new Error('No se encontró el input de nombre');
    const emailInput = screen.getByTestId('email');
    if (!emailInput) throw new Error('No se encontró el input de correo');
    const messageInput = screen.getByTestId('message');
    if (!messageInput) throw new Error('No se encontró el input de mensaje');

    expect((nameInput as HTMLInputElement).type).toBe('text');
    expect((emailInput as HTMLInputElement).type).toBe('email');
    expect((messageInput as HTMLTextAreaElement).tagName).toBe('TEXTAREA');
  });

  it('debug DOM', () => {
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );
    // Imprime el HTML generado
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML);
  });
});

describe('encode', () => {
  it('convierte un objeto a query string correctamente', () => {
    // Importar encode directamente del archivo Contact
    // @ts-ignore
    const { encode } = require('./Contact');
    const data = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      message: '¡Hola!',
    };
    const result = encode(data);
    expect(result).toBe(
      'name=Juan%20P%C3%A9rez&email=juan%40example.com&message=%C2%A1Hola!'
    );
  });
});
