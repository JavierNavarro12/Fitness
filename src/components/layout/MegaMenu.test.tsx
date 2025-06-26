import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MegaMenu from './MegaMenu';

describe('MegaMenu', () => {
  it('renderiza correctamente', () => {
    render(<MegaMenu />);
  });

  it('abre el menú al hacer hover', () => {
    const { getByText, queryByText } = render(<MegaMenu />);
    const button = getByText('Inicio');
    
    // Simular hover
    fireEvent.mouseEnter(button);
    expect(queryByText('Conócenos')).toBeInTheDocument();
    expect(queryByText('Deportes')).toBeInTheDocument();
    expect(queryByText('Salud y Bienestar')).toBeInTheDocument();
  });

  it('llama a onSectionSelect cuando se hace click en una sección', () => {
    const onSectionSelect = jest.fn();
    const { getByText } = render(<MegaMenu onSectionSelect={onSectionSelect} />);
    
    // Abrir menú
    const button = getByText('Inicio');
    fireEvent.mouseEnter(button);
    
    // Hacer click en una sección
    fireEvent.click(getByText('Deportes'));
    expect(onSectionSelect).toHaveBeenCalledWith('deportes');
  });

  it('no muestra el menú inicialmente', () => {
    const { queryByText } = render(<MegaMenu />);
    expect(queryByText('Conócenos')).not.toBeInTheDocument();
  });
});

export {}; 