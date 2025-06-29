import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Auth from './Auth';

// Importar las funciones mockadas después de los mocks
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { doc, setDoc, getDoc } from 'firebase/firestore';

// Mock Firebase Auth
const mockAuth = {
  currentUser: null,
};

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => false,
    })
  ),
}));

// Mock Firebase config
jest.mock('../../../firebase', () => ({
  db: {},
}));

// Mock de saveUserToFirestore para que no haga nada
jest.mock('./Auth', () => {
  const originalModule = jest.requireActual('./Auth');
  return {
    __esModule: true,
    ...originalModule,
    saveUserToFirestore: jest.fn(),
  };
});

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'Iniciar Sesión': 'Iniciar Sesión',
        'Crear Cuenta': 'Crear Cuenta',
        Nombre: 'Nombre',
        Apellido: 'Apellido',
        'Correo electrónico': 'Correo electrónico',
        Contraseña: 'Contraseña',
        'Cargando...': 'Cargando...',
        '¿No tienes cuenta?': '¿No tienes cuenta?',
        '¿Ya tienes cuenta?': '¿Ya tienes cuenta?',
        Regístrate: 'Regístrate',
        'Inicia sesión': 'Inicia sesión',
        'Continuar con Google': 'Continuar con Google',
        '¡Sesión iniciada correctamente!': '¡Sesión iniciada correctamente!',
        '¡Cuenta creada correctamente!': '¡Cuenta creada correctamente!',
        'Email o contraseña incorrectos.': 'Email o contraseña incorrectos.',
        'Este correo electrónico ya está en uso.':
          'Este correo electrónico ya está en uso.',
        'Ocurrió un error. Por favor, inténtalo de nuevo.':
          'Ocurrió un error. Por favor, inténtalo de nuevo.',
        '¡Sesión iniciada con Google!': '¡Sesión iniciada con Google!',
        'No se pudo iniciar sesión con Google.':
          'No se pudo iniciar sesión con Google.',
        '¡Email de recuperación enviado! Revisa tu bandeja de entrada y carpeta de spam. Si no lo encuentras, espera unos minutos y revisa nuevamente.':
          '¡Email de recuperación enviado! Revisa tu bandeja de entrada y carpeta de spam. Si no lo encuentras, espera unos minutos y revisa nuevamente.',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Auth Component', () => {
  const mockOnAuthSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthSuccess.mockClear();
    // Ensure getAuth returns our mock
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    // Ensure Firestore functions are properly mocked
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    (doc as jest.Mock).mockReturnValue({});
  });

  test('renders login form by default', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    expect(
      screen.getByRole('heading', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Correo electrónico')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
  });

  test('shows forgot password link in login mode', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });

  test('does not show forgot password link in register mode', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    // Cambiar a modo registro
    fireEvent.click(screen.getByText('Regístrate'));

    expect(
      screen.queryByText('¿Olvidaste tu contraseña?')
    ).not.toBeInTheDocument();
  });

  test('shows forgot password form when clicking forgot password link', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    expect(
      screen.getByRole('heading', { name: 'Recuperar Contraseña' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Enviar Email de Recuperación' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('← Volver al inicio de sesión')
    ).toBeInTheDocument();
  });

  test('sends password reset email successfully', async () => {
    (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    // Ir al formulario de recuperación
    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // Llenar el email
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    userEvent.type(emailInput, 'test@example.com');

    // Enviar el formulario
    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar Email de Recuperación' })
    );

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com'
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          '¡Email de recuperación enviado! Revisa tu bandeja de entrada y carpeta de spam. Si no lo encuentras, espera unos minutos y revisa nuevamente.'
        )
      ).toBeInTheDocument();
    });
  });

  test('shows error when email is empty in forgot password form', async () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    // Ir al formulario de recuperación
    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // Enviar el formulario sin email
    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar Email de Recuperación' })
    );

    await waitFor(() => {
      expect(
        screen.getByText('Por favor, ingresa tu correo electrónico.')
      ).toBeInTheDocument();
    });
  });

  test('shows error when user not found in forgot password', async () => {
    const error = { code: 'auth/user-not-found' };
    (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(error);

    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    // Ir al formulario de recuperación
    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // Llenar el email
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    userEvent.type(emailInput, 'nonexistent@example.com');

    // Enviar el formulario
    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar Email de Recuperación' })
    );

    await waitFor(() => {
      expect(
        screen.getByText('No existe una cuenta con este correo electrónico.')
      ).toBeInTheDocument();
    });
  });

  test('shows error when email is invalid in forgot password', async () => {
    const error = { code: 'auth/invalid-email' };
    (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(error);

    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    // Ir al formulario de recuperación
    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // Llenar el email
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    userEvent.type(emailInput, 'invalid-email');

    // Enviar el formulario
    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar Email de Recuperación' })
    );

    await waitFor(() => {
      expect(
        screen.getByText('El correo electrónico no es válido.')
      ).toBeInTheDocument();
    });
  });

  test('returns to login form when clicking back button', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    // Ir al formulario de recuperación
    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // Volver al login
    fireEvent.click(screen.getByText('← Volver al inicio de sesión'));

    expect(
      screen.getByRole('heading', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Recuperar Contraseña')).not.toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');

    userEvent.type(emailInput, 'test@example.com');
    userEvent.type(passwordInput, 'password123');

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText('¡Sesión iniciada correctamente!')
      ).toBeInTheDocument();
    });
  });

  test('handles successful registration', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    // Cambiar a modo registro
    fireEvent.click(screen.getByText('Regístrate'));

    const firstNameInput = screen.getByPlaceholderText('Nombre');
    const lastNameInput = screen.getByPlaceholderText('Apellido');
    const emailInput = screen.getByPlaceholderText('Correo electrónico');
    const passwordInput = screen.getByPlaceholderText('Contraseña');

    userEvent.type(firstNameInput, 'John');
    userEvent.type(lastNameInput, 'Doe');
    userEvent.type(emailInput, 'test@example.com');
    userEvent.type(passwordInput, 'password123');

    fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText('¡Cuenta creada correctamente!')
      ).toBeInTheDocument();
    });
  });

  test('handles Google sign in', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    fireEvent.click(screen.getByText('Continuar con Google'));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText('¡Sesión iniciada con Google!')
      ).toBeInTheDocument();
    });
  });

  test('handles guest mode', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    fireEvent.click(screen.getByText('Seguir como invitado'));

    expect(mockOnAuthSuccess).toHaveBeenCalledWith(true);
  });

  test('switches between login and register modes', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

    // Cambiar a registro
    fireEvent.click(screen.getByText('Regístrate'));
    expect(
      screen.getByRole('heading', { name: 'Crear Cuenta' })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apellido')).toBeInTheDocument();

    // Cambiar de vuelta a login
    fireEvent.click(screen.getByText('Inicia sesión'));
    expect(
      screen.getByRole('heading', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Nombre')).not.toBeInTheDocument();
  });
});
