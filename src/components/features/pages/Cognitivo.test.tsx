import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Cognitivo, { CognitivoCard } from './Cognitivo';
import React from 'react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() }
  }),
}));

jest.mock('aos', () => ({
  init: jest.fn(),
  refresh: jest.fn(),
}));

describe('Cognitivo', () => {
  beforeAll(() => {
    // Mock scrollIntoView y style
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renderiza sin errores', () => {
    render(
      <HelmetProvider>
        <Cognitivo itemToHighlight={null} onHighlightComplete={() => {}} />
      </HelmetProvider>
    );
    expect(screen.getByText('cognitivo.title')).toBeInTheDocument();
  });

  it('llama a onHighlightComplete si itemToHighlight es válido', async () => {
    const div = document.createElement('div');
    div.id = 'test-id';
    document.body.appendChild(div);
    const onHighlightComplete = jest.fn();
    render(
      <HelmetProvider>
        <Cognitivo
          itemToHighlight={{ page: 'cognitivo', id: 'test-id' }}
          onHighlightComplete={onHighlightComplete}
        />
      </HelmetProvider>
    );
    // Esperar a que se llame a onHighlightComplete (después del timeout)
    await waitFor(() => {
      expect(onHighlightComplete).toHaveBeenCalled();
    });
    document.body.removeChild(div);
  });

  it('renderiza CognitivoCard con puntosClave.length === 0', () => {
    const { container } = render(
      <HelmetProvider>
        <CognitivoCard
          id="test"
          title="test-title"
          content={"Sin puntos clave"}
          icon={<span>icon</span>}
          image="/test.jpg"
        />
      </HelmetProvider>
    );
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('no renderiza puntos clave con nombre o desc vacío', () => {
    const { container } = render(
      <HelmetProvider>
        <CognitivoCard
          id="test"
          title="test-title"
          content={"Nombre1:Desc1. :DescSinNombre. NombreSinDesc:"}
          icon={<span>icon</span>}
          image="/test.jpg"
        />
      </HelmetProvider>
    );
    // Solo debe renderizar el punto válido
    expect(container.querySelectorAll('li').length).toBe(1);
    expect(container).toHaveTextContent('Nombre1:');
    expect(container).toHaveTextContent('Desc1');
    expect(container).not.toHaveTextContent('DescSinNombre');
    expect(container).not.toHaveTextContent('NombreSinDesc');
  });

  it('no llama a onHighlightComplete si page no es cognitivo', async () => {
    const onHighlightComplete = jest.fn();
    render(
      <HelmetProvider>
        <Cognitivo
          itemToHighlight={{ page: 'otra', id: 'test-id' }}
          onHighlightComplete={onHighlightComplete}
        />
      </HelmetProvider>
    );
    // Esperar un poco para asegurarnos que no se llama
    await waitFor(() => {
      expect(onHighlightComplete).not.toHaveBeenCalled();
    });
  });

  it('limpia el timeout si itemToHighlight cambia antes de ejecutarse', () => {
    jest.useFakeTimers();
    const div = document.createElement('div');
    div.id = 'test-id';
    document.body.appendChild(div);
    const onHighlightComplete = jest.fn();
    const { rerender } = render(
      <HelmetProvider>
        <Cognitivo
          itemToHighlight={{ page: 'cognitivo', id: 'test-id' }}
          onHighlightComplete={onHighlightComplete}
        />
      </HelmetProvider>
    );
    // Cambiar la prop antes de que pase el timeout
    rerender(
      <HelmetProvider>
        <Cognitivo itemToHighlight={null} onHighlightComplete={onHighlightComplete} />
      </HelmetProvider>
    );
    jest.advanceTimersByTime(200);
    expect(onHighlightComplete).not.toHaveBeenCalled();
    document.body.removeChild(div);
    jest.useRealTimers();
  });
}); 