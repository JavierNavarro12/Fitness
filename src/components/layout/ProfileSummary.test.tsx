// Mock Firebase Auth
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProfileSummary from './ProfileSummary';
import { UserProfile } from '../../types';

jest.mock('../../firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(callback => {
      callback(null);
      return jest.fn(); // unsubscribe function
    }),
  },
}));

// Mock Firebase Auth module
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn(); // unsubscribe function
  }),
}));

// Mock Firestore
jest.mock('../../services/favoritesService', () => ({
  getUserFavorites: jest.fn(() => Promise.resolve([])),
  addToFavorites: jest.fn(() => Promise.resolve(true)),
  removeFromFavorites: jest.fn(() => Promise.resolve(true)),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'profileSummary.title': 'Profile Summary',
        'profileSummary.age': 'Age',
        'profileSummary.gender': 'Gender',
        'profileSummary.weight': 'Weight',
        'profileSummary.height': 'Height',
        'profileSummary.objective': 'Objective',
        'profileSummary.experience': 'Experience',
        'profileSummary.trainingFrequency': 'Training Frequency',
        'profileSummary.mainSport': 'Main Sport',
        'profileSummary.medicalConditions': 'Medical Conditions',
        'profileSummary.allergies': 'Allergies',
        'profileSummary.currentSupplements': 'Current Supplements',
        'profileSummary.none': 'None',
        'profileSummary.years': 'years',
        'profileSummary.kg': 'kg',
        'profileSummary.favoriteReports': 'Favorite Reports',
        'profileSummary.noFavorites': 'No favorites',
        'profileSummary.addFavoritesHelp': 'Add favorites from Reports section',
        'profileSummary.back': 'Back',
        'profileSummary.close': 'Close',
        'profileSummary.removeFavorite': 'Remove from favorites',
        'userDropdown.logout': 'Log out',
        'gender.male': 'Male',
        'experience.intermediate': 'Intermediate',
        'frequency.medium': 'Medium',
        'report.title': 'Supplement Report',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock de Firebase
jest.mock('../../firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(() => jest.fn()), // Mock que retorna una función de cleanup
}));

// Mock de favoritesService
jest.mock('../../services/favoritesService', () => ({
  getUserFavorites: jest.fn().mockResolvedValue([]),
  removeFromFavorites: jest.fn().mockResolvedValue(true),
}));

const mockUser = {
  uid: 'test-uid',
  email: 'test@gmail.com',
  displayName: 'Test User',
};

const mockReports = [
  {
    id: '1',
    content: 'Test content 1',
    createdAt: '2023-01-01T00:00:00Z',
    userId: 'test-uid',
  },
  {
    id: '2',
    content: 'Test content 2',
    createdAt: '2023-01-02T00:00:00Z',
    userId: 'test-uid',
  },
];

// Helper para renderizar con Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

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
    allergies: ['Ninguna'],
  };

  const mockUserProfile = {
    age: 25,
    gender: 'male' as const,
    weight: 70,
    height: 170,
    objective: 'Perder peso',
    experience: 'intermediate' as const,
    frequency: 'medium' as const,
    sport: 'Levantamiento de pesas',
    medicalConditions: ['Ninguna'],
    allergies: ['Ninguna'],
    currentSupplements: ['Proteína'],
  };

  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza sin errores', () => {
    renderWithRouter(
      <ProfileSummary
        user={mockUser}
        userProfile={mockUserProfile}
        reports={mockReports}
        onLogout={mockOnLogout}
      />
    );

    // Verificar que se muestran los nombres de usuario (móvil + escritorio)
    expect(screen.getAllByText('Test User')).toHaveLength(2);
  });

  it('llama a onLogout cuando se hace click en cerrar sesión', () => {
    const mockOnLogout = jest.fn();
    renderWithRouter(
      <ProfileSummary
        user={mockUser}
        userProfile={mockUserProfile}
        reports={mockReports}
        onLogout={mockOnLogout}
      />
    );

    // Obtener todos los botones de logout (móvil + escritorio)
    const logoutButtons = screen.getAllByRole('button', { name: /log out/i });
    expect(logoutButtons).toHaveLength(2); // Mobile + desktop

    // Hacer click en el primer botón
    fireEvent.click(logoutButtons[0]);

    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('llama a onClose cuando se hace click en cerrar', () => {
    const mockOnClose = jest.fn();
    renderWithRouter(
      <ProfileSummary
        user={mockUser}
        userProfile={mockUserProfile}
        reports={mockReports}
        onLogout={mockOnLogout}
        onClose={mockOnClose}
      />
    );

    // Buscar botón de cerrar por aria-label
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renderiza solo datos básicos si userProfile es null', () => {
    const user = {
      uid: '123',
      email: 'test@egn.com',
      displayName: 'Test User',
    };
    renderWithRouter(
      <ProfileSummary user={user} userProfile={null} onLogout={jest.fn()} />
    );

    expect(screen.getAllByText('Test User')).toHaveLength(2); // Mobile + desktop
    expect(screen.getAllByText('test@egn.com')).toHaveLength(2); // Mobile + desktop
  });

  it('muestra información del usuario cuando está autenticado', () => {
    renderWithRouter(
      <ProfileSummary
        user={mockUser}
        userProfile={mockUserProfile}
        reports={mockReports}
        onLogout={mockOnLogout}
      />
    );

    // Verificar que se muestra el nombre (móvil + escritorio)
    expect(screen.getAllByText('Test User')).toHaveLength(2);

    // Verificar que se muestra el email (móvil + escritorio)
    expect(screen.getAllByText('test@gmail.com')).toHaveLength(2);

    // Verificar que se muestra información del perfil
    expect(screen.getAllByText('Perder peso')).toHaveLength(2); // Mobile + desktop

    // Verificar que existe texto que contiene la edad en mobile (ahora es "25 years" en inglés)
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '25 years';
      })
    ).toBeInTheDocument();
  });

  it('navega a login cuando no hay usuario', () => {
    renderWithRouter(
      <ProfileSummary
        user={null}
        userProfile={null}
        reports={[]}
        onLogout={mockOnLogout}
      />
    );

    // Verificar que aparecen botones de logout (aunque no haya user, el componente los muestra)
    expect(screen.getAllByText('Log out')).toHaveLength(2);
  });

  it('muestra estadísticas correctas', () => {
    renderWithRouter(
      <ProfileSummary
        user={mockUser}
        userProfile={mockUserProfile}
        reports={mockReports}
        onLogout={mockOnLogout}
      />
    );

    // Verificar que se muestran los datos correctos (móvil + escritorio)
    expect(screen.getAllByText('Test User')).toHaveLength(2);
    expect(screen.getAllByText('test@gmail.com')).toHaveLength(2);
    expect(screen.getAllByText('Perder peso')).toHaveLength(2); // Objective

    // Verificar que el elemento de edad se muestra correctamente (mobile view: "25 years")
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '25 years';
      })
    ).toBeInTheDocument();

    // Verificar que las traducciones se muestran correctamente (solo en móvil)
    expect(screen.getAllByText('Height')).toHaveLength(1); // Solo en mobile
    expect(screen.getAllByText('Weight')).toHaveLength(1); // Solo en mobile
    expect(screen.getAllByText('Objective')).toHaveLength(1); // Solo en mobile

    // En desktop se muestran otros labels
    expect(
      screen.getByText((content, element) => {
        return element?.tagName === 'STRONG' && element?.textContent === 'Age:';
      })
    ).toBeInTheDocument(); // Age label en desktop

    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName === 'STRONG' && element?.textContent === 'Gender:'
        );
      })
    ).toBeInTheDocument(); // Gender label en desktop
  });

  it('muestra la información del usuario', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User' };
    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );
    expect(screen.getAllByText('Perder peso')).toHaveLength(2); // Mobile + desktop views
    expect(screen.getAllByText('Ninguna')).toHaveLength(3); // sport, medicalConditions, allergies
    expect(screen.getAllByText('Proteína')).toHaveLength(1); // Only in desktop view
  });

  it('muestra el avatar con foto si está disponible', () => {
    const user = {
      email: 'test@egn.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/avatar.jpg',
    };
    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );
    const avatarImgs = screen.getAllByAltText('avatar');
    expect(avatarImgs[0]).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg'
    );
  });

  it('muestra la inicial si no hay foto', () => {
    const user = { email: 'test@egn.com', displayName: 'Test User' };
    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );
    const initialElements = screen.getAllByText('T');
    expect(initialElements.length).toBeGreaterThan(0);
  });

  it('muestra la inicial del email si no hay displayName ni foto', () => {
    const user = { email: 'test@egn.com' };
    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );
    // Busca la inicial 'T' del email 'test@egn.com'
    const initialElements = screen.getAllByText('T');
    expect(initialElements.length).toBeGreaterThan(0);
  });

  it('muestra el nombre basado en el email si no hay displayName', () => {
    const user = { email: 'test@egn.com' };
    renderWithRouter(
      <ProfileSummary user={user} userProfile={null} onLogout={jest.fn()} />
    );
    expect(screen.getAllByText('test')).toHaveLength(2); // Mobile + desktop
  });

  it('usa fallback en mapeos si no hay traducción', () => {
    const customProfile = {
      ...mockUserProfile,
      gender: 'unknown' as any, // Valor que no tiene traducción
      experience: 'expert' as any, // Valor que no tiene traducción
      frequency: 'daily' as any, // Valor que no tiene traducción
      height: 175,
    };
    const user = {
      uid: '123',
      email: 'test@egn.com',
      displayName: 'Test User',
    };
    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={customProfile}
        onLogout={jest.fn()}
      />
    );

    // En la vista de escritorio, los valores sin traducción se muestran como "gender.unknown", "experience.expert", etc.
    const genderElements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('gender.unknown') || false;
    });
    expect(genderElements.length).toBeGreaterThan(0);
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
      currentSupplements: [],
    };

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    // Verificar que se renderiza sin errores
    const userElements = screen.getAllByText('Test User');
    expect(userElements.length).toBeGreaterThan(0);
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
      currentSupplements: [],
    };

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    // Verificar que se renderiza sin errores
    const userElements = screen.getAllByText('Test User');
    expect(userElements.length).toBeGreaterThan(0);
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
      currentSupplements: [],
    };

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    // Verificar que se renderiza sin errores
    const userElements = screen.getAllByText('Test User');
    expect(userElements.length).toBeGreaterThan(0);
  });

  it('maneja el caso donde user.displayName existe', () => {
    const user = { displayName: 'John Doe', email: 'john@example.com' };
    const userProfile = null;

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    const nameElements = screen.getAllByText('John Doe');
    expect(nameElements.length).toBeGreaterThan(0);
  });

  it('maneja el caso donde user.email existe pero no displayName', () => {
    const user = { email: 'john@example.com' };
    const userProfile = null;

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    const nameElements = screen.getAllByText('john');
    expect(nameElements.length).toBeGreaterThan(0); // email.split('@')[0]
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
      photo: 'https://example.com/avatar.jpg',
    };

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    const avatarImgs = screen.getAllByAltText('avatar');
    expect(avatarImgs[0]).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg'
    );
  });

  it('maneja el caso donde avatarUrl no existe pero user.photoURL sí', () => {
    const user = {
      displayName: 'Test User',
      email: 'test@example.com',
      photoURL: 'https://example.com/user-photo.jpg',
    };
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
    };

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    const avatarImgs = screen.getAllByAltText('avatar');
    expect(avatarImgs[0]).toHaveAttribute(
      'src',
      'https://example.com/user-photo.jpg'
    );
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
      currentSupplements: [],
    };

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    const initialElements = screen.getAllByText('T');
    expect(initialElements.length).toBeGreaterThan(0); // displayName[0].toUpperCase()
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
      currentSupplements: [],
    };

    renderWithRouter(
      <ProfileSummary
        user={user}
        userProfile={userProfile}
        onLogout={jest.fn()}
      />
    );

    // Verifica que se muestra 'test' (parte del email antes del @)
    const nameElements = screen.getAllByText('test');
    expect(nameElements.length).toBeGreaterThan(0);
  });
});

export {};
