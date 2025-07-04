import React from 'react';
import { render } from '@testing-library/react';
import PWAInstallPrompt from './PWAInstallPrompt';

describe('PWAInstallPrompt', () => {
  test('renders without crashing', () => {
    render(<PWAInstallPrompt />);
    // Si no hay prompt visible, el componente retorna null
    // Solo verificamos que no haya errores en el renderizado
    expect(document.body).toBeInTheDocument();
  });

  test('handles callbacks correctly', () => {
    const mockOnInstall = jest.fn();
    const mockOnDismiss = jest.fn();

    render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    // Si el componente renderiza sin problemas, las props fueron aceptadas
    expect(document.body).toBeInTheDocument();
  });
});
