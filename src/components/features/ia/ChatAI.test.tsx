import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatAI from './ChatAI';

// Mock de fetch global
global.fetch = jest.fn();

// Mock de scrollIntoView
const mockScrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

describe('ChatAI Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders chat button initially', () => {
    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    expect(chatButton).toBeInTheDocument();
    expect(chatButton).toHaveTextContent('💬');
  });

  test('opens chat window when button is clicked', async () => {
    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    // Verificar que se abre la ventana de chat
    expect(screen.getByText('EGN IA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pregúntame sobre suplementación...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  test('closes chat window when close button is clicked', async () => {
    render(<ChatAI />);
    
    // Abrir chat
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    // Verificar que está abierto
    expect(screen.getByText('EGN IA')).toBeInTheDocument();
    
    // Cerrar chat
    const closeButton = screen.getByRole('button', { name: '×' });
    await userEvent.click(closeButton);
    
    // Verificar que se cierra
    expect(screen.queryByText('EGN IA')).not.toBeInTheDocument();
  });

  test('shows empty state message when no messages', async () => {
    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    expect(screen.getByText('¡Hazme una pregunta sobre suplementación!')).toBeInTheDocument();
  });

  test('allows typing in input field', async () => {
    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    
    expect(input).toHaveValue('¿Qué proteína me recomiendas?');
  });

  test('sends message when send button is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Te recomiendo proteína whey isolate.' }),
    });

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    await userEvent.click(sendButton);
    
    // Verificar que se envía la petición
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/.netlify/functions/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: '¿Qué proteína me recomiendas?' }],
        }),
      });
    });
  });

  test('sends message when Enter key is pressed', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Te recomiendo proteína whey isolate.' }),
    });

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Verificar que se envía la petición
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/.netlify/functions/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: '¿Qué proteína me recomiendas?' }],
        }),
      });
    });
  });

  test('does not send empty messages', async () => {
    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    // Intentar enviar mensaje vacío
    await userEvent.click(sendButton);
    
    // Verificar que no se envía la petición
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('shows loading state while sending message', async () => {
    // Mock de fetch que no resuelve inmediatamente
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    await userEvent.click(sendButton);
    
    // Verificar estado de carga
    expect(sendButton).toHaveTextContent('...');
    expect(input).toBeDisabled();
  });

  test('displays user and assistant messages correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Te recomiendo proteína whey isolate.' }),
    });

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    await userEvent.click(sendButton);
    
    // Verificar que se muestran los mensajes
    await waitFor(() => {
      expect(screen.getByText('¿Qué proteína me recomiendas?')).toBeInTheDocument();
      expect(screen.getByText('Te recomiendo proteína whey isolate.')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    await userEvent.click(sendButton);
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Ocurrió un error al conectar con la IA.')).toBeInTheDocument();
    });
  });

  test('handles HTTP error response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    await userEvent.click(sendButton);
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Ocurrió un error al conectar con la IA.')).toBeInTheDocument();
    });
  });

  test('handles API response without reply field', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'No reply field' }),
    });

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    await userEvent.click(sendButton);
    
    // Verificar mensaje por defecto
    await waitFor(() => {
      expect(screen.getByText('Lo siento, no tengo respuesta en este momento.')).toBeInTheDocument();
    });
  });

  test('clears input after sending message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Te recomiendo proteína whey isolate.' }),
    });

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    await userEvent.click(sendButton);
    
    // Verificar que el input se limpia
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  test('prevents sending message while loading', async () => {
    // Mock de fetch que no resuelve inmediatamente
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    render(<ChatAI />);
    
    const chatButton = screen.getByRole('button', { name: /abrir chat ia/i });
    await userEvent.click(chatButton);
    
    const input = screen.getByPlaceholderText('Pregúntame sobre suplementación...');
    const sendButton = screen.getByRole('button', { name: 'Enviar' });
    
    await userEvent.type(input, '¿Qué proteína me recomiendas?');
    await userEvent.click(sendButton);
    
    // Intentar enviar otro mensaje mientras está cargando
    await userEvent.type(input, 'Segunda pregunta');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Verificar que no se envía la segunda petición
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
}); 