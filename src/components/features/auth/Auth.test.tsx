import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Auth from './Auth';

// Mock de Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signInWithPopup: jest.fn(),
  })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  GoogleAuthProvider: jest.fn(() => ({})),
  signInWithPopup: jest.fn(),
}));

// Mock de Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({})),
  setDoc: jest.fn(),
}));

// Mock de Firebase
jest.mock('../../../firebase', () => ({
  db: {},
}));

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'Iniciar Sesión': 'Iniciar Sesión',
        'Crear Cuenta': 'Crear Cuenta',
        'Nombre': 'Nombre',
        'Apellido': 'Apellido',
        'Correo electrónico': 'Correo electrónico',
        'Contraseña': 'Contraseña',
        'Recuérdame': 'Recuérdame',
        '¿Olvidaste tu contraseña?': '¿Olvidaste tu contraseña?',
        'Cargando...': 'Cargando...',
        '¿No tienes cuenta?': '¿No tienes cuenta?',
        '¿Ya tienes cuenta?': '¿Ya tienes cuenta?',
        'Regístrate': 'Regístrate',
        'Inicia sesión': 'Inicia sesión',
        'O continuar con': 'O continuar con',
        'Continuar con Google': 'Continuar con Google',
        'Introduce tu nombre': 'Introduce tu nombre',
        'Introduce tus apellidos': 'Introduce tus apellidos',
        '¡Sesión iniciada correctamente!': '¡Sesión iniciada correctamente!',
        '¡Cuenta creada correctamente!': '¡Cuenta creada correctamente!',
        'Email o contraseña incorrectos.': 'Email o contraseña incorrectos.',
        'Este correo electrónico ya está en uso.': 'Este correo electrónico ya está en uso.',
        'Ocurrió un error. Por favor, inténtalo de nuevo.': 'Ocurrió un error. Por favor, inténtalo de nuevo.',
        'Introduce tu email para recuperar la contraseña.': 'Introduce tu email para recuperar la contraseña.',
        'Se ha enviado un email para restablecer la contraseña.': 'Se ha enviado un email para restablecer la contraseña.',
        'No se pudo enviar el email. ¿Seguro que el correo es correcto?': 'No se pudo enviar el email. ¿Seguro que el correo es correcto?',
        '¡Sesión iniciada con Google!': '¡Sesión iniciada con Google!',
        'No se pudo iniciar sesión con Google.': 'No se pudo iniciar sesión con Google.',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Auth Component', () => {
  const mockOnAuthSuccess = jest.fn();

  beforeEach(() => {
    mockOnAuthSuccess.mockClear();
  });

  test('renders login form by default', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
    
    // Verificar que se renderiza el formulario de login
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });

  test('switches to register form when clicking register link', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
    
    // Hacer clic en el enlace de registro
    const registerLink = screen.getByText('Regístrate');
    userEvent.click(registerLink);
    
    // Verificar que cambió al formulario de registro
    expect(screen.getByRole('heading', { name: 'Crear Cuenta' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Introduce tu nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Introduce tus apellidos')).toBeInTheDocument();
  });

  test('switches back to login form when clicking login link', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
    
    // Cambiar a registro
    const registerLink = screen.getByText('Regístrate');
    userEvent.click(registerLink);
    
    // Cambiar de vuelta a login
    const loginLink = screen.getByText('Inicia sesión');
    userEvent.click(loginLink);
    
    // Verificar que volvió al formulario de login
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Introduce tu nombre')).not.toBeInTheDocument();
  });

  test('can fill email and password fields', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
    
    // Llenar campos
    const emailInput = screen.getByPlaceholderText('email@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Verificar que los valores se establecieron
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('can fill registration form fields', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
    
    // Cambiar a registro
    const registerLink = screen.getByText('Regístrate');
    userEvent.click(registerLink);
    
    // Llenar campos de registro
    const firstNameInput = screen.getByPlaceholderText('Introduce tu nombre');
    const lastNameInput = screen.getByPlaceholderText('Introduce tus apellidos');
    const emailInput = screen.getByPlaceholderText('email@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Verificar que los valores se establecieron
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows Google sign in button', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
    
    // Verificar que el botón de Google está presente
    expect(screen.getByText('Continuar con Google')).toBeInTheDocument();
  });

  test('shows remember me checkbox', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
    
    // Verificar que el checkbox "Recuérdame" está presente
    expect(screen.getByLabelText('Recuérdame')).toBeInTheDocument();
  });

  test('handles forgot password without email', () => {
    render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
    
    // Hacer clic en "¿Olvidaste tu contraseña?" sin email
    const forgotPasswordLink = screen.getByText('¿Olvidaste tu contraseña?');
    userEvent.click(forgotPasswordLink);
    
    // Verificar que se muestra el error
    expect(screen.getByText('Introduce tu email para recuperar la contraseña.')).toBeInTheDocument();
  });
}); 