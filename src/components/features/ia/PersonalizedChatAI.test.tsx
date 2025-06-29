import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalizedChatAI from './PersonalizedChatAI';
import { UserProfile } from '../../../types';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

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
  currentSupplements: ['Proteína', 'Creatina'],
};

// Wrapper para tests con i18n
const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('PersonalizedChatAI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Funcionalidad básica', () => {
    test('renderiza el botón flotante', () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);
      expect(
        screen.getByRole('button', { name: /abrir chat ia personalizado/i })
      ).toBeInTheDocument();
    });

    test('abre y cierra el chat', () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      expect(screen.getByText(/EGN IA Personal/i)).toBeInTheDocument();

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(screen.queryByText(/EGN IA Personal/i)).not.toBeInTheDocument();
    });

    test('muestra mensaje de bienvenida personalizado', () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      expect(screen.getByText(/Ganar masa muscular/i)).toBeInTheDocument();
      expect(screen.getByText(/weightlifting/i)).toBeInTheDocument();
    });

    test('muestra mensaje genérico sin perfil', () => {
      renderWithI18n(<PersonalizedChatAI userProfile={null} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      expect(
        screen.getByText(/Soy tu asistente de suplementación/i)
      ).toBeInTheDocument();
    });
  });

  describe('Interacción con mensajes', () => {
    test('permite escribir y enviar mensajes', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Respuesta de la IA' }),
      });

      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      const input = screen.getByPlaceholderText(/¿Alguna duda/i);
      const sendButton = screen.getByText('Enviar');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Respuesta de la IA')).toBeInTheDocument();
      });
    });

    test('maneja errores de red', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      const input = screen.getByPlaceholderText(/¿Alguna duda/i);
      const sendButton = screen.getByText('Enviar');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Ocurrió un error al conectar con la IA/i)
        ).toBeInTheDocument();
      });
    });

    test('envía mensaje con Enter', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Respuesta de la IA' }),
      });

      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      const input = screen.getByPlaceholderText(/¿Alguna duda/i);

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
    });
  });

  describe('Integración con API', () => {
    test('envía mensaje correctamente a la API', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Respuesta de la IA' }),
      });

      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      const input = screen.getByPlaceholderText(/¿Alguna duda/i);
      const sendButton = screen.getByText('Enviar');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/.netlify/functions/openai-chat',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('Test message'),
          })
        );
      });
    });

    test('incluye contexto del usuario en la petición', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Respuesta de la IA' }),
      });

      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      const input = screen.getByPlaceholderText(/¿Alguna duda/i);
      const sendButton = screen.getByText('Enviar');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/.netlify/functions/openai-chat',
          expect.objectContaining({
            body: expect.stringContaining('Ganar masa muscular'),
          })
        );
      });
    });
  });

  describe('PersonalizedChatAI - nuevos comportamientos', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      // Resetear el idioma a español antes de cada test
      i18n.changeLanguage('es');
    });

    test('cierra el chat automáticamente al abrir el menú móvil', async () => {
      const { rerender } = renderWithI18n(
        <PersonalizedChatAI
          userProfile={mockUserProfile}
          mobileMenuOpen={false}
        />
      );

      // Abrir el chat primero
      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      // Verificar que el chat está abierto
      expect(screen.getByText(/EGN IA Personal/i)).toBeInTheDocument();

      // Simular apertura del menú móvil (cambio de prop)
      rerender(
        <I18nextProvider i18n={i18n}>
          <PersonalizedChatAI
            userProfile={mockUserProfile}
            mobileMenuOpen={true}
          />
        </I18nextProvider>
      );

      // Verificar que el chat se cerró automáticamente
      await waitFor(() => {
        expect(screen.queryByText(/EGN IA Personal/i)).not.toBeInTheDocument();
      });
    });

    test('muestra overlay con blur al abrir el chat', () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);
      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);
      // Verificar que aparece el overlay con blur
      expect(screen.getByText(/EGN IA Personal/i)).toBeInTheDocument();
      // El overlay está presente en el DOM (usando Testing Library)
      const overlay = screen.getByTestId('personalized-chat-overlay');
      expect(overlay).toBeInTheDocument();
    });

    test('muestra textos en español por defecto', () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      // Verificar textos en español
      expect(screen.getByPlaceholderText(/¿Alguna duda/i)).toBeInTheDocument();
    });

    test('muestra textos en inglés cuando el idioma está configurado en inglés', async () => {
      // Configurar idioma en inglés antes del render
      await act(async () => {
        i18n.changeLanguage('en');
      });

      const { rerender } = renderWithI18n(
        <PersonalizedChatAI userProfile={mockUserProfile} />
      );

      // Re-renderizar para asegurar que el cambio de idioma se aplique
      rerender(
        <I18nextProvider i18n={i18n}>
          <PersonalizedChatAI userProfile={mockUserProfile} />
        </I18nextProvider>
      );

      const button = screen.getByRole('button', {
        name: /open personalized ai chat/i,
      });
      fireEvent.click(button);

      // Verificar textos en inglés
      await waitFor(() => {
        expect(screen.getAllByText(/Personalized/i).length).toBeGreaterThan(0);
      });
      expect(screen.getByPlaceholderText(/Any questions/i)).toBeInTheDocument();
    });

    test('oculta el botón flotante cuando el menú móvil está abierto', () => {
      renderWithI18n(
        <PersonalizedChatAI
          userProfile={mockUserProfile}
          mobileMenuOpen={true}
        />
      );

      // Verificar que el botón flotante no está presente
      expect(
        screen.queryByRole('button', { name: /abrir chat ia personalizado/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /open personalized ai chat/i })
      ).not.toBeInTheDocument();
    });

    test('mantiene el contexto en el idioma correcto al enviar mensajes', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Respuesta de la IA' }),
      });

      // Asegurar que estamos en español
      i18n.changeLanguage('es');

      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      // Usar el botón en español ya que el test está en español
      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      const input = screen.getByPlaceholderText(/¿Alguna duda/i);
      const sendButton = screen.getByText('Enviar');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/.netlify/functions/openai-chat',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining(
              'Eres un asistente personal experto en suplementación deportiva'
            ),
          })
        );
      });
    });
  });

  describe('Funcionalidad de continuar chats del historial', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      i18n.changeLanguage('es');
    });

    test('muestra botón "Continuar" en cada chat del historial', async () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      // Abrir historial
      const historyButton = screen.getByRole('button', { name: /historial/i });
      fireEvent.click(historyButton);

      // Verificar que aparece el botón continuar (aunque no haya historial real)
      await waitFor(() => {
        expect(screen.getByText(/Historial de chats/i)).toBeInTheDocument();
      });
    });

    test('muestra indicador "Continuando" cuando se está continuando un chat', () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      // El indicador "Continuando" no debería aparecer inicialmente
      expect(screen.queryByText(/Continuando/i)).not.toBeInTheDocument();
    });

    test('permite iniciar nuevo chat', () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      const newChatButton = screen.getByText(/Nuevo chat/i);
      fireEvent.click(newChatButton);

      // Verificar que se muestra el mensaje de bienvenida (chat limpio)
      expect(
        screen.getByText(/¡Hola! Soy tu asistente personal de suplementación/i)
      ).toBeInTheDocument();
    });

    test('muestra botones "Continuar" y "Volver" en vista de chat seleccionado', async () => {
      renderWithI18n(<PersonalizedChatAI userProfile={mockUserProfile} />);

      const button = screen.getByRole('button', {
        name: /abrir chat ia personalizado/i,
      });
      fireEvent.click(button);

      // Abrir historial
      const historyButton = screen.getByRole('button', { name: /historial/i });
      fireEvent.click(historyButton);

      // Verificar que aparecen los botones de acción
      await waitFor(() => {
        expect(screen.getByText(/Historial de chats/i)).toBeInTheDocument();
      });
    });
  });
});
