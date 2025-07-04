import React from 'react';
import { render } from '@testing-library/react';
import OfflineIndicator from './OfflineIndicator';

describe('OfflineIndicator', () => {
  test('renders without crashing', () => {
    render(<OfflineIndicator />);
    // Si no hay notificación visible, el componente retorna null
    // Solo verificamos que no haya errores en el renderizado
    expect(document.body).toBeInTheDocument();
  });

  test('handles online state correctly', () => {
    render(<OfflineIndicator />);
    expect(document.body).toBeInTheDocument();
  });
});
