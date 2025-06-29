import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders the loader SVG', () => {
    render(<Loader />);
    // Verifica que el SVG esté presente usando data-testid
    const svg = screen.getByTestId('loader-svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders the loading container', () => {
    render(<Loader />);
    // Verifica que el div con la clase loading esté presente usando data-testid
    expect(screen.getByTestId('loader-loading')).toBeInTheDocument();
  });
});
