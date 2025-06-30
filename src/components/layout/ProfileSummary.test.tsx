import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
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

  it('muestra el avatar con foto si está disponible', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User', photoURL: 'https://example.com/avatar.jpg' };
    const { getByAltText } = render(<ProfileSummary user={user} userProfile={userProfile} onLogout={jest.fn()} />);
    expect(getByAltText('avatar')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('muestra la inicial si no hay foto', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User' };
    const { getByText } = render(<ProfileSummary user={user} userProfile={userProfile} onLogout={jest.fn()} />);
    expect(getByText('T')).toBeInTheDocument();
  });

  it('muestra el emoji si no hay displayName ni foto', () => {
    const user = { email: 'test@egn.com' };
    const { getByText } = render(<ProfileSummary user={user} userProfile={userProfile} onLogout={jest.fn()} />);
    expect(getByText('👤')).toBeInTheDocument();
  });

  it('renderiza solo datos básicos si userProfile es null', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User' };
    const { getByText, queryByText } = render(<ProfileSummary user={user} userProfile={null} onLogout={jest.fn()} />);
    expect(getByText('Test User')).toBeInTheDocument();
    expect(getByText('test@egn.com')).toBeInTheDocument();
    expect(queryByText('Perder peso')).not.toBeInTheDocument();
  });

  it('muestra el nombre basado en el email si no hay displayName', () => {
    const user = { email: 'test@egn.com' };
    const { getByText } = render(<ProfileSummary user={user} userProfile={null} onLogout={jest.fn()} />);
    expect(getByText('test')).toBeInTheDocument();
  });

  it('usa fallback en mapeos si no hay traducción', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User' };
    const customProfile = { ...userProfile, gender: '' as const, experience: '' as const, frequency: '' as const };
    const { getByText } = render(<ProfileSummary user={user} userProfile={customProfile} onLogout={jest.fn()} />);
    expect(getByText((content, node) => node?.textContent === 'profile.gender:')).toBeInTheDocument();
    expect(getByText((content, node) => node?.textContent === 'profile.experience:')).toBeInTheDocument();
    expect(getByText((content, node) => node?.textContent === 'profile.trainingFrequency:')).toBeInTheDocument();
  });

  it('maneja el caso donde las traducciones de gender no existen', () => {
    const user = { displayName: 'Test User', email: 'test@example.com' };
    const userProfile: UserProfile = { 
      age: 25, 
      gender: 'unknown' as any, 
      weight: 70, 
      height: 175, 
      objective: 'lose weight', 
      experience: 'beginner', 
      frequency: 'medium', 
      sport: 'running', 
      medicalConditions: [], 
      allergies: [], 
      currentSupplements: [] 
    };

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    // Verificar que se renderiza sin errores
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('maneja el caso donde las traducciones de experience no existen', () => {
    const user = { displayName: 'Test User', email: 'test@example.com' };
    const userProfile: UserProfile = { 
      age: 25, 
      gender: 'male', 
      weight: 70, 
      height: 175, 
      objective: 'lose weight', 
      experience: 'unknown' as any, 
      frequency: 'medium', 
      sport: 'running', 
      medicalConditions: [], 
      allergies: [], 
      currentSupplements: [] 
    };

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    // Verificar que se renderiza sin errores
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('maneja el caso donde las traducciones de frequency no existen', () => {
    const user = { displayName: 'Test User', email: 'test@example.com' };
    const userProfile: UserProfile = { 
      age: 25, 
      gender: 'male', 
      weight: 70, 
      height: 175, 
      objective: 'lose weight', 
      experience: 'beginner', 
      frequency: 'unknown' as any, 
      sport: 'running', 
      medicalConditions: [], 
      allergies: [], 
      currentSupplements: [] 
    };

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    // Verificar que se renderiza sin errores
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('maneja el caso donde user.displayName existe', () => {
    const user = { displayName: 'John Doe', email: 'john@example.com' };
    const userProfile = null;

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('maneja el caso donde user.email existe pero no displayName', () => {
    const user = { email: 'john@example.com' };
    const userProfile = null;

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    expect(screen.getByText('john')).toBeInTheDocument(); // email.split('@')[0]
  });

  it('maneja el caso donde avatarUrl existe', () => {
    const user = { displayName: 'Test User', email: 'test@example.com' };
    const userProfile: UserProfile = { 
      age: 25, 
      gender: 'male', 
      weight: 70, 
      height: 175, 
      objective: 'lose weight', 
      experience: 'beginner', 
      frequency: 'medium', 
      sport: 'running', 
      medicalConditions: [], 
      allergies: [], 
      currentSupplements: [],
      photo: 'https://example.com/avatar.jpg'
    };

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    const avatarImg = screen.getByAltText('avatar');
    expect(avatarImg).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('maneja el caso donde avatarUrl no existe pero user.photoURL sí', () => {
    const user = { displayName: 'Test User', email: 'test@example.com', photoURL: 'https://example.com/user-photo.jpg' };
    const userProfile: UserProfile = { 
      age: 25, 
      gender: 'male', 
      weight: 70, 
      height: 175, 
      objective: 'lose weight', 
      experience: 'beginner', 
      frequency: 'medium', 
      sport: 'running', 
      medicalConditions: [], 
      allergies: [], 
      currentSupplements: []
    };

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    const avatarImg = screen.getByAltText('avatar');
    expect(avatarImg).toHaveAttribute('src', 'https://example.com/user-photo.jpg');
  });

  it('maneja el caso donde ninguna foto existe', () => {
    const user = { displayName: 'Test User', email: 'test@example.com' };
    const userProfile: UserProfile = { 
      age: 25, 
      gender: 'male', 
      weight: 70, 
      height: 175, 
      objective: 'lose weight', 
      experience: 'beginner', 
      frequency: 'medium', 
      sport: 'running', 
      medicalConditions: [], 
      allergies: [], 
      currentSupplements: []
    };

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    expect(screen.getByText('T')).toBeInTheDocument(); // displayName[0].toUpperCase()
  });

  it('maneja el caso donde user.displayName no existe', () => {
    const user = { email: 'test@example.com' };
    const userProfile: UserProfile = { 
      age: 25, 
      gender: 'male', 
      weight: 70, 
      height: 175, 
      objective: 'lose weight', 
      experience: 'beginner', 
      frequency: 'medium', 
      sport: 'running', 
      medicalConditions: [], 
      allergies: [], 
      currentSupplements: []
    };

    render(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    expect(screen.getByText('👤')).toBeInTheDocument(); // fallback emoji
  });
});

export {}; 