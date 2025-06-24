import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalizedChatAI from './PersonalizedChatAI';
import { UserProfile } from '../../../types';

// Mock fetch
global.fetch = jest.fn();

const mockUserProfile: UserProfile = {
  age: 25,
  gender: 'male',
  weight: 75,
  height: 180,
  objective: 'Ganar masa muscular',
  experience: 'intermediate',
  frequency: 'medium',
  sport: 'sports.weightlifting',
  medicalConditions: ['Hipertensión'],
  allergies: ['Lactosa'],
  currentSupplements: ['Proteína', 'Creatina']
};

const mockUserProfileWithoutOptional: UserProfile = {
  age: 30,
  gender: 'female',
  weight: 60,
  height: 165,
  objective: 'Perder peso',
  experience: 'beginner',
  frequency: 'low',
  sport: 'sports.running',
  medicalConditions: [],
  allergies: [],
  currentSupplements: []
};

describe('PersonalizedChatAI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('Renderizado inicial', () => {
    test('renderiza el botón flotante', () => {
      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('🤖');
    });

    test('no renderiza la ventana de chat inicialmente', () => {
      render(<PersonalizedChatAI userProfile={null} />);
      
      expect(screen.queryByText(/EGN IA Personal/i)).not.toBeInTheDocument();
    });

    test('muestra mensaje de bienvenida sin perfil', () => {
      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      expect(screen.getByText(/¡Hola! Soy tu asistente de suplementación/i)).toBeInTheDocument();
    });

    test('muestra mensaje de bienvenida personalizado con perfil', () => {
      render(<PersonalizedChatAI userProfile={mockUserProfile} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      expect(screen.getByText(/Veo que tu objetivo es Ganar masa muscular/i)).toBeInTheDocument();
      expect(screen.getByText(/practicas weightlifting/i)).toBeInTheDocument();
    });
  });

  describe('Interacciones del usuario', () => {
    test('abre y cierra la ventana de chat', () => {
      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      
      // Abrir chat
      fireEvent.click(button);
      expect(screen.getByText(/EGN IA Personal/i)).toBeInTheDocument();
      
      // Cerrar chat
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      expect(screen.queryByText(/EGN IA Personal/i)).not.toBeInTheDocument();
    });

    test('permite escribir en el input', () => {
      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/pregúntame sobre suplementación/i);
      fireEvent.change(input, { target: { value: '¿Qué proteína recomiendas?' } });
      
      expect(input).toHaveValue('¿Qué proteína recomiendas?');
    });

    test('envía mensaje con Enter', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Te recomiendo proteína whey isolate.' })
      });

      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/pregúntame sobre suplementación/i);
      fireEvent.change(input, { target: { value: '¿Qué proteína recomiendas?' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('¿Qué proteína recomiendas?')).toBeInTheDocument();
      });
    });

    test('envía mensaje con botón', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Te recomiendo proteína whey isolate.' })
      });

      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/pregúntame sobre suplementación/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: '¿Qué proteína recomiendas?' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('¿Qué proteína recomiendas?')).toBeInTheDocument();
      });
    });
  });

  describe('Integración con API', () => {
    test('envía mensaje correctamente a la API', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Respuesta de la IA' })
      });

      render(<PersonalizedChatAI userProfile={mockUserProfile} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/alguna duda/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/.netlify/functions/openai-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('Test message')
        });
      });
    });

    test('maneja errores de API', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/pregúntame sobre suplementación/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Ocurrió un error al conectar con la IA.')).toBeInTheDocument();
      });
    });

    test('maneja respuesta HTTP no exitosa', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/pregúntame sobre suplementación/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Ocurrió un error al conectar con la IA.')).toBeInTheDocument();
      });
    });
  });

  describe('Mapeo de datos del perfil', () => {
    test('mapea correctamente el género', () => {
      render(<PersonalizedChatAI userProfile={mockUserProfile} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      // Verificar que el contexto del sistema incluya el género mapeado
      const input = screen.getByPlaceholderText(/alguna duda/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.click(sendButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Género: Masculino')
        })
      );
    });

    test('mapea correctamente la experiencia', () => {
      render(<PersonalizedChatAI userProfile={mockUserProfile} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/alguna duda/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.click(sendButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Nivel de experiencia: Intermedio')
        })
      );
    });

    test('mapea correctamente la frecuencia', () => {
      render(<PersonalizedChatAI userProfile={mockUserProfile} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/alguna duda/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.click(sendButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Frecuencia de entrenamiento: Media (3-4 veces/semana)')
        })
      );
    });
  });

  describe('Renderizado condicional', () => {
    test('muestra badge "Personalizado" cuando hay perfil', () => {
      render(<PersonalizedChatAI userProfile={mockUserProfile} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      expect(screen.getByText('Personalizado')).toBeInTheDocument();
    });

    test('no muestra badge "Personalizado" sin perfil', () => {
      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      expect(screen.queryByText('Personalizado')).not.toBeInTheDocument();
    });

    test('usa placeholder correcto según perfil', () => {
      render(<PersonalizedChatAI userProfile={mockUserProfile} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      expect(screen.getByPlaceholderText(/alguna duda/i)).toBeInTheDocument();
    });

    test('usa placeholder genérico sin perfil', () => {
      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      expect(screen.getByPlaceholderText(/pregúntame sobre suplementación/i)).toBeInTheDocument();
    });
  });

  describe('Estados de loading', () => {
    test('muestra estado de loading durante envío', async () => {
      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ reply: 'Respuesta' })
        }), 100))
      );

      render(<PersonalizedChatAI userProfile={null} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/pregúntame sobre suplementación/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      expect(sendButton).toHaveTextContent('...');
      expect(sendButton).toBeDisabled();
      expect(input).toBeDisabled();
    });
  });

  describe('Manejo de campos opcionales', () => {
    test('maneja perfil sin campos opcionales', () => {
      render(<PersonalizedChatAI userProfile={mockUserProfileWithoutOptional} />);
      
      const button = screen.getByRole('button', { name: /abrir chat ia personalizado/i });
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText(/alguna duda/i);
      const sendButton = screen.getByText('Enviar');
      
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.click(sendButton);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Condiciones médicas: Ninguna')
        })
      );
      
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Alergias: Ninguna')
        })
      );
      
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Suplementos actuales: Ninguno')
        })
      );
    });
  });
}); 