import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock de react-router-dom
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/login',
  search: '',
  hash: '',
  state: null,
  key: 'test-key'
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock del componente Auth
jest.mock('../auth/Auth', () => {
  return function MockAuth({ onAuthSuccess }: { onAuthSuccess: (isInvitado?: boolean) => void }) {
    return (
      <div data-testid="auth-component">
        <button onClick={() => onAuthSuccess(false)} data-testid="auth-success">
          Login Success
        </button>
        <button onClick={() => onAuthSuccess(true)} data-testid="auth-invitado">
          Login Invitado
        </button>
      </div>
    );
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza sin errores', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('auth-component')).toBeInTheDocument();
  });

  it('maneja autenticación exitosa sin invitado', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const authSuccessButton = screen.getByTestId('auth-success');
    authSuccessButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('maneja autenticación exitosa con invitado', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const authInvitadoButton = screen.getByTestId('auth-invitado');
    authInvitadoButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('usa redirección por defecto cuando no hay parámetro redirect', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const authSuccessButton = screen.getByTestId('auth-success');
    authSuccessButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
}); 