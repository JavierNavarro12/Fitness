import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Welcome from './Welcome';

describe('Welcome', () => {
  it('renderiza el texto de bienvenida y la lista', () => {
    render(<Welcome onStart={jest.fn()} />);
    expect(screen.getByText('¡Bienvenido a EGN!')).toBeInTheDocument();
    expect(screen.getByText(/asistente personal/i)).toBeInTheDocument();
    expect(screen.getByText('¿Qué encontrarás aquí?')).toBeInTheDocument();
    expect(screen.getByText('Evaluación personalizada de tus necesidades')).toBeInTheDocument();
    expect(screen.getByText('Comenzar Ahora')).toBeInTheDocument();
  });

  it('llama a onStart al hacer click en el botón', () => {
    const onStart = jest.fn();
    render(<Welcome onStart={onStart} />);
    fireEvent.click(screen.getByRole('button', { name: /comenzar ahora/i }));
    expect(onStart).toHaveBeenCalled();
  });
}); 