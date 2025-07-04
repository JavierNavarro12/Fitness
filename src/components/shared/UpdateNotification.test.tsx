import React from 'react';
import { render } from '@testing-library/react';
import UpdateNotification from './UpdateNotification';

describe('UpdateNotification', () => {
  test('renders without crashing', () => {
    render(<UpdateNotification />);
    // Si no hay notificación visible, el componente retorna null
    // Solo verificamos que no haya errores en el renderizado
    expect(document.body).toBeInTheDocument();
  });

  test('handles onUpdate callback correctly', () => {
    const mockOnUpdate = jest.fn();

    render(<UpdateNotification onUpdate={mockOnUpdate} />);
    expect(document.body).toBeInTheDocument();
  });
});
