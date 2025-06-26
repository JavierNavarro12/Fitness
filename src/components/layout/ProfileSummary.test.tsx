import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ProfileSummary from './ProfileSummary';
import { UserProfile } from '../../types';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() }
  }),
}));

describe('ProfileSummary', () => {
  const userProfile = {
    objective: 'Perder peso',
    sport: 'Ninguna',
    currentSupplements: ['Proteína'],
    experience: 'beginner' as const,
    frequency: 'medium' as const,
    weight: 70,
    height: 175,
    age: 25,
    gender: 'male' as const,
    medicalConditions: ['Ninguna'],
    allergies: ['Ninguna']
  };

  it('muestra la información del usuario', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User' };
    const { getByText, getAllByText } = render(<ProfileSummary user={user} userProfile={userProfile} onLogout={jest.fn()} />);
    expect(getByText('Perder peso')).toBeInTheDocument();
    expect(getAllByText('Ninguna')).toHaveLength(3); // sport, medicalConditions, allergies
    expect(getByText('Proteína')).toBeInTheDocument();
  });

  it('llama a onLogout cuando se hace click en cerrar sesión', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User' };
    const onLogout = jest.fn();
    const { getByText } = render(<ProfileSummary user={user} userProfile={userProfile} onLogout={onLogout} />);
    fireEvent.click(getByText('userDropdown.logout'));
    expect(onLogout).toHaveBeenCalled();
  });

  it('llama a onClose cuando se hace click en cerrar', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User' };
    const onClose = jest.fn();
    const { getByText } = render(<ProfileSummary user={user} userProfile={userProfile} onLogout={jest.fn()} onClose={onClose} />);
    fireEvent.click(getByText('×'));
    expect(onClose).toHaveBeenCalled();
  });
});

export {}; 