import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';

// Mock de useTranslation
const mockT = jest.fn((key) => {
  if (key === 'Tu Nombre') return 'Tu Nombre';
  if (key === 'Tu Correo Electrónico') return 'Tu Correo Electrónico';
  if (key === 'Escribe tu mensaje aquí...') return 'Escribe tu mensaje aquí...';
  if (key === 'Contacta con Nosotros') return 'Contacta con Nosotros';
  if (key === 'Enviar Mensaje') return 'Enviar Mensaje';
  if (key === 'Enviando...') return 'Enviando...';
  if (key === '¡Mensaje enviado con éxito! Gracias por contactarnos.') return '¡Mensaje enviado con éxito! Gracias por contactarnos.';
  if (key === 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.') return 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
  return key;
});
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

import Contact from './Contact';

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
    const { container } = render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    expect(container.querySelector('#name')).toBeInTheDocument();
    expect(container.querySelector('#email')).toBeInTheDocument();
    expect(container.querySelector('#message')).toBeInTheDocument();
    expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
  });

  it('maneja cambios en los campos del formulario', () => {
    const { container } = render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = container.querySelector('#name') as HTMLInputElement;
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const messageInput = container.querySelector('#message') as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hola, tengo una pregunta' } });

    expect(nameInput.value).toBe('Juan Pérez');
    expect(emailInput.value).toBe('juan@example.com');
    expect(messageInput.value).toBe('Hola, tengo una pregunta');
  });

  it('maneja envío exitoso del formulario', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const { container } = render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = container.querySelector('#name') as HTMLInputElement;
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const messageInput = container.querySelector('#message') as HTMLTextAreaElement;
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hola, tengo una pregunta' } });

    fireEvent.click(submitButton);

    // El botón debe estar deshabilitado durante el envío
    expect(submitButton).toBeDisabled();

    // Esperar a que se complete el envío
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
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
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { container } = render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = container.querySelector('#name') as HTMLInputElement;
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const messageInput = container.querySelector('#message') as HTMLTextAreaElement;
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hola, tengo una pregunta' } });

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
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const { container } = render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = container.querySelector('#name') as HTMLInputElement;
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const messageInput = container.querySelector('#message') as HTMLTextAreaElement;
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hola, tengo una pregunta' } });

    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('codifica correctamente los datos del formulario', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const { container } = render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = container.querySelector('#name') as HTMLInputElement;
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const messageInput = container.querySelector('#message') as HTMLTextAreaElement;
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: 'María José' } });
    fireEvent.change(emailInput, { target: { value: 'maria@test.com' } });
    fireEvent.change(messageInput, { target: { value: '¿Cómo estás? & gracias!' } });

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
    const { container } = render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = container.querySelector('#name') as HTMLInputElement;
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const messageInput = container.querySelector('#message') as HTMLTextAreaElement;

    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');

    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(messageInput).toHaveAttribute('required');
  });

  it('maneja diferentes tipos de entrada', () => {
    const { container } = render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );

    const nameInput = container.querySelector('#name') as HTMLInputElement;
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const messageInput = container.querySelector('#message') as HTMLTextAreaElement;

    expect(nameInput.type).toBe('text');
    expect(emailInput.type).toBe('email');
    expect(messageInput.tagName).toBe('TEXTAREA');
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
    const data = { name: 'Juan Pérez', email: 'juan@example.com', message: '¡Hola!' };
    const result = encode(data);
    expect(result).toBe('name=Juan%20P%C3%A9rez&email=juan%40example.com&message=%C2%A1Hola!');
  });
}); 