import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserDrawer from './UserDrawer';
jest.mock('../../i18n', () => ({}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => new Promise(() => {}) },
  }),
  Trans: ({ children }: any) => children,
}));

describe('UserDrawer', () => {
  const baseProps = {
    open: true,
    onClose: jest.fn(),
    user: {
      firstName: 'Javier',
      lastName: 'Navarro',
      email: 'javier@email.com',
    },
    onProfile: jest.fn(),
    onReports: jest.fn(),
    onLogout: jest.fn(),
    isGuest: false,
    onLogin: jest.fn(),
    onRegister: jest.fn(),
  };

  it('does not render when open is false', () => {
    render(<UserDrawer {...baseProps} open={false} />);
    expect(screen.queryByText(/Javier/i)).not.toBeInTheDocument();
  });

  it('renders user info and profile/logout buttons for authenticated user', () => {
    render(<UserDrawer {...baseProps} />);
    expect(screen.getAllByText(/Javier/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/javier@email.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /profile/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('renders login/register buttons for guest user', () => {
    render(<UserDrawer {...baseProps} isGuest={true} />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    render(<UserDrawer {...baseProps} onClose={onClose} />);
    const overlay = screen.getByTestId('userdrawer-overlay');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onProfile and onClose when profile button is clicked', () => {
    const onProfile = jest.fn();
    const onClose = jest.fn();
    render(
      <UserDrawer {...baseProps} onProfile={onProfile} onClose={onClose} />
    );
    fireEvent.click(screen.getByRole('button', { name: /profile/i }));
    expect(onProfile).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onLogout and onClose when logout button is clicked (authenticated)', () => {
    const onLogout = jest.fn();
    const onClose = jest.fn();
    render(<UserDrawer {...baseProps} onLogout={onLogout} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(onLogout).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onLogin and onClose when login button is clicked (guest)', () => {
    const onLogin = jest.fn();
    const onClose = jest.fn();
    render(
      <UserDrawer
        {...baseProps}
        isGuest={true}
        onLogin={onLogin}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(onLogin).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onRegister and onClose when register button is clicked (guest)', () => {
    const onRegister = jest.fn();
    const onClose = jest.fn();
    render(
      <UserDrawer
        {...baseProps}
        isGuest={true}
        onRegister={onRegister}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(onRegister).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});

export {};
