import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import UserDrawer from './UserDrawer';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() }
  }),
}));

describe('UserDrawer', () => {
  const baseProps = {
    open: true,
    user: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@egn.com'
    },
    onClose: jest.fn(),
    onProfile: jest.fn(),
    onReports: jest.fn(),
    onLogout: jest.fn(),
    isGuest: false,
    onLogin: jest.fn(),
    onRegister: jest.fn(),
  };

  it('muestra datos del usuario', () => {
    const { getByText } = render(<UserDrawer {...baseProps} />);
    expect(getByText('Test')).toBeInTheDocument();
    expect(getByText('test@egn.com')).toBeInTheDocument();
  });

  it('llama a onClose al hacer click en cerrar', () => {
    const { getByText } = render(<UserDrawer {...baseProps} />);
    fireEvent.click(getByText('×'));
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('llama a onLogout al hacer click en logout', () => {
    const { getByText } = render(<UserDrawer {...baseProps} />);
    fireEvent.click(getByText('userDrawer.logout'));
    expect(baseProps.onLogout).toHaveBeenCalled();
  });

  it('no renderiza cuando open es false', () => {
    const { container } = render(<UserDrawer {...baseProps} open={false} />);
    expect(container.firstChild).toBeNull();
  });
});

export {}; 