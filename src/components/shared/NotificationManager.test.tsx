import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationManager from './NotificationManager';
import { notificationService } from '../../services/notificationService';

// Mock del servicio de notificaciones
jest.mock('../../services/notificationService', () => ({
  notificationService: {
    initialize: jest.fn(),
    hasPermission: jest.fn(),
    requestPermission: jest.fn(),
    getDeviceToken: jest.fn(),
    showNotification: jest.fn(),
    showSupplementReminder: jest.fn(),
    generateUserNotifications: jest.fn(),
  },
}));

// Mock de useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('NotificationManager', () => {
  const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
  };

  const mockUserProfile = {
    age: 25,
    gender: 'male' as const,
    weight: 70,
    height: 175,
    objective: 'ganar masa muscular',
    sport: 'fútbol',
    experience: 'intermediate' as const,
    frequency: 'medium' as const,
    medicalConditions: [],
    allergies: [],
    currentSupplements: ['Proteína', 'Creatina'],
  };

  beforeEach(() => {
    // Mock Notification API
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'default',
        requestPermission: jest.fn(() => Promise.resolve('granted')),
      },
      writable: true,
    });

    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        ready: Promise.resolve({
          showNotification: jest.fn(),
          getNotifications: jest.fn(() => Promise.resolve([])),
        }),
      },
      writable: true,
    });

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should not render when user is not logged in', () => {
    render(<NotificationManager userProfile={mockUserProfile} user={null} />);

    expect(screen.queryByText('Notificaciones Push')).not.toBeInTheDocument();
  });

  it('should render when user is logged in', () => {
    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    expect(screen.getByText('Notificaciones Push')).toBeInTheDocument();
    expect(screen.getByText('⚡ No configuradas')).toBeInTheDocument();
  });

  it('should show settings when clicking settings button', () => {
    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.click(settingsButton);

    expect(
      screen.getByText(/Activa las notificaciones para recibir recordatorios/)
    ).toBeInTheDocument();
  });

  it('should show activation button when permissions are default', () => {
    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.click(settingsButton);

    expect(screen.getByText('🔔 Activar Notificaciones')).toBeInTheDocument();
  });

  it('should call requestPermission when activation button is clicked', async () => {
    const mockRequestPermission = jest.fn().mockResolvedValue(true);
    const mockInitialize = jest.fn().mockResolvedValue(true);
    const mockGetDeviceToken = jest.fn().mockResolvedValue('test-token');
    const mockShowNotification = jest.fn().mockResolvedValue(true);
    const mockGenerateUserNotifications = jest.fn().mockReturnValue([]);

    (notificationService.requestPermission as jest.Mock).mockImplementation(
      mockRequestPermission
    );
    (notificationService.initialize as jest.Mock).mockImplementation(
      mockInitialize
    );
    (notificationService.getDeviceToken as jest.Mock).mockImplementation(
      mockGetDeviceToken
    );
    (notificationService.showNotification as jest.Mock).mockImplementation(
      mockShowNotification
    );
    (
      notificationService.generateUserNotifications as jest.Mock
    ).mockImplementation(mockGenerateUserNotifications);

    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.click(settingsButton);

    const activateButton = screen.getByText('🔔 Activar Notificaciones');
    fireEvent.click(activateButton);

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalled();
    });
  });

  it('should show granted status when permissions are granted', () => {
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'granted',
      },
      writable: true,
    });

    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    expect(screen.getByText('✅ Activadas')).toBeInTheDocument();
  });

  it('should show denied status when permissions are denied', () => {
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'denied',
      },
      writable: true,
    });

    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    expect(screen.getByText('❌ Bloqueadas')).toBeInTheDocument();
  });

  it('should show supplement list when user has supplements', () => {
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'granted',
      },
      writable: true,
    });

    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.click(settingsButton);

    expect(
      screen.getByText('📋 Recordatorios configurados para:')
    ).toBeInTheDocument();
    expect(screen.getByText('• Proteína')).toBeInTheDocument();
    expect(screen.getByText('• Creatina')).toBeInTheDocument();
  });

  it('should handle initialization on mount', async () => {
    const mockInitialize = jest.fn().mockResolvedValue(true);
    const mockHasPermission = jest.fn().mockReturnValue(true);
    const mockGetDeviceToken = jest.fn().mockResolvedValue('test-token');

    (notificationService.initialize as jest.Mock).mockImplementation(
      mockInitialize
    );
    (notificationService.hasPermission as jest.Mock).mockImplementation(
      mockHasPermission
    );
    (notificationService.getDeviceToken as jest.Mock).mockImplementation(
      mockGetDeviceToken
    );

    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalled();
    });
  });

  it('should show blocked instructions when permissions are denied', () => {
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'denied',
      },
      writable: true,
    });

    render(
      <NotificationManager userProfile={mockUserProfile} user={mockUser} />
    );

    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.click(settingsButton);

    expect(
      screen.getByText('Las notificaciones están bloqueadas. Para activarlas:')
    ).toBeInTheDocument();
    expect(
      screen.getByText('• Haz clic en el candado 🔒 en la barra de direcciones')
    ).toBeInTheDocument();
  });

  it('should handle user profile without supplements', () => {
    const profileWithoutSupplements = {
      ...mockUserProfile,
      currentSupplements: [],
    };

    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'granted',
      },
      writable: true,
    });

    render(
      <NotificationManager
        userProfile={profileWithoutSupplements}
        user={mockUser}
      />
    );

    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.click(settingsButton);

    expect(
      screen.queryByText('📋 Recordatorios configurados para:')
    ).not.toBeInTheDocument();
  });
});
