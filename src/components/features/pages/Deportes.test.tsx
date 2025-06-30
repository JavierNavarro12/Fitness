import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { DeporteCard, default as Deportes } from './Deportes';
import React from 'react';

// Mock de AOS
jest.mock('aos', () => ({
  init: jest.fn(),
  refresh: jest.fn(),
}));

// Mock de useTranslation
const mockT = jest.fn((key) => {
  return key || '';
});
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

// Mock de searchableContent
jest.mock('../../../data/content', () => ({
  searchableContent: [
    {
      id: 'deporte1',
      title: 'deportes.deporte1.title',
      image: '/deporte1.jpg',
      content: 'deportes.deporte1.content',
      category: 'deportes'
    },
    {
      id: 'deporte2', 
      title: 'deportes.deporte2.title',
      image: '/deporte2.jpg',
      content: 'deportes.deporte2.content',
      category: 'deportes'
    }
  ]
}));

// Mock de document.getElementById
const mockGetElementById = jest.fn();
Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true
});

// Mock de scrollIntoView
const mockScrollIntoView = jest.fn();
const mockElement = {
  scrollIntoView: mockScrollIntoView,
  style: {}
};

describe('DeporteCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza DeporteCard con contenido normal', () => {
    const mockContent = 'Intro. Suplemento1: Descripción1. Suplemento2: Descripción2.';
    mockT.mockImplementation((key) => {
      if (key === 'test-title') return 'Test Title';
      if (key === 'deportes.card.suplementos') return 'Suplementos';
      if (key === mockContent) return mockContent;
      return key || '';
    });

    render(
      <HelmetProvider>
        <DeporteCard
          id="test"
          title="test-title"
          content={mockContent}
          image="/test.jpg"
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Suplementos')).toBeInTheDocument();
    expect(screen.getByText('Intro.')).toBeInTheDocument();
  });

  it('renderiza DeporteCard con contenido sin suplementos', () => {
    const mockContent = 'Solo intro sin suplementos.';
    mockT.mockImplementation((key) => {
      if (key === 'test-title') return 'Test Title';
      if (key === 'deportes.card.suplementos') return 'Suplementos';
      if (key === mockContent) return mockContent;
      return key || '';
    });

    render(
      <HelmetProvider>
        <DeporteCard
          id="test"
          title="test-title"
          content={mockContent}
          image="/test.jpg"
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Suplementos')).toBeInTheDocument();
    expect(screen.getByText('Solo intro sin suplementos.')).toBeInTheDocument();
  });

  it('renderiza DeporteCard con suplementos mal formateados', () => {
    const mockContent = 'Intro. Suplemento1. Suplemento2: Descripción2.';
    mockT.mockImplementation((key) => {
      if (key === 'test-title') return 'Test Title';
      if (key === 'deportes.card.suplementos') return 'Suplementos';
      if (key === mockContent) return mockContent;
      return key || '';
    });

    render(
      <HelmetProvider>
        <DeporteCard
          id="test"
          title="test-title"
          content={mockContent}
          image="/test.jpg"
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Suplementos')).toBeInTheDocument();
    expect(screen.getByText('Intro.')).toBeInTheDocument();
  });

  it('renderiza DeporteCard con suplemento sin descripción', () => {
    const mockContent = 'Intro. Suplemento1: . Suplemento2: Descripción2.';
    mockT.mockImplementation((key) => {
      if (key === 'test-title') return 'Test Title';
      if (key === 'deportes.card.suplementos') return 'Suplementos';
      if (key === mockContent) return mockContent;
      return key || '';
    });

    render(
      <HelmetProvider>
        <DeporteCard
          id="test"
          title="test-title"
          content={mockContent}
          image="/test.jpg"
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Suplementos')).toBeInTheDocument();
    expect(screen.getByText('Intro.')).toBeInTheDocument();
  });
});

describe('Deportes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockT.mockImplementation((key) => key || '');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderDeportes = (props = {}) => {
    const defaultProps = {
      itemToHighlight: null,
      onHighlightComplete: jest.fn(),
      ...props
    };

    return render(
      <BrowserRouter>
        <HelmetProvider>
          <Deportes {...defaultProps} />
        </HelmetProvider>
      </BrowserRouter>
    );
  };

  it('renderiza el componente Deportes correctamente', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'deportes.title': 'Deportes',
        'deportes.description': 'Descripción de deportes',
        'deportes.stats.title': 'Estadísticas',
        'deportes.stats.fitness': 'Fitness',
        'deportes.stats.crossfit': 'Crossfit',
        'deportes.stats.resistencia': 'Resistencia',
        'deportes.stats.equipo': 'Equipo',
        'Rendimiento Deportivo': 'Rendimiento Deportivo'
      };
      return translations[key] || key;
    });

    renderDeportes();

    expect(screen.getByText('Deportes')).toBeInTheDocument();
    expect(screen.getByText('Descripción de deportes')).toBeInTheDocument();
    expect(screen.getByText('Estadísticas')).toBeInTheDocument();
    expect(screen.getByText('Fitness')).toBeInTheDocument();
    expect(screen.getByText('Crossfit')).toBeInTheDocument();
    expect(screen.getByText('Resistencia')).toBeInTheDocument();
    expect(screen.getByText('Equipo')).toBeInTheDocument();
  });

  it('inicializa AOS en el useEffect', () => {
    const AOS = require('aos');
    renderDeportes();

    expect(AOS.init).toHaveBeenCalledWith({ once: true });
    expect(AOS.refresh).toHaveBeenCalled();
  });

  it('maneja highlighting cuando itemToHighlight es válido', async () => {
    const onHighlightComplete = jest.fn();
    mockGetElementById.mockReturnValue(mockElement);

    renderDeportes({
      itemToHighlight: { page: 'deportes', id: 'deporte1' },
      onHighlightComplete
    });

    // Avanzar el timer para ejecutar el setTimeout
    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('deporte1');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    });

    // Avanzar el timer para ejecutar el segundo setTimeout
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(onHighlightComplete).toHaveBeenCalled();
    });
  });

  it('no ejecuta highlighting cuando itemToHighlight es null', () => {
    const onHighlightComplete = jest.fn();

    renderDeportes({
      itemToHighlight: null,
      onHighlightComplete
    });

    expect(mockGetElementById).not.toHaveBeenCalled();
    expect(onHighlightComplete).not.toHaveBeenCalled();
  });

  it('no ejecuta highlighting cuando itemToHighlight.page no es deportes', () => {
    const onHighlightComplete = jest.fn();

    renderDeportes({
      itemToHighlight: { page: 'otra-pagina', id: 'deporte1' },
      onHighlightComplete
    });

    expect(mockGetElementById).not.toHaveBeenCalled();
    expect(onHighlightComplete).not.toHaveBeenCalled();
  });

  it('maneja el caso cuando el elemento no se encuentra', async () => {
    const onHighlightComplete = jest.fn();
    mockGetElementById.mockReturnValue(null);

    renderDeportes({
      itemToHighlight: { page: 'deportes', id: 'elemento-inexistente' },
      onHighlightComplete
    });

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('elemento-inexistente');
      expect(onHighlightComplete).toHaveBeenCalled();
    });
  });

  it('renderiza las estadísticas con los valores correctos', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'deportes.stats.fitness': 'Fitness',
        'deportes.stats.crossfit': 'Crossfit',
        'deportes.stats.resistencia': 'Resistencia',
        'deportes.stats.equipo': 'Equipo'
      };
      return translations[key] || key;
    });

    renderDeportes();

    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('23%')).toBeInTheDocument();
    expect(screen.getByText('89%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('renderiza los datos de deportes desde searchableContent', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'deportes.deporte1.title': 'Deporte 1',
        'deportes.deporte2.title': 'Deporte 2',
        'deportes.deporte1.content': 'Contenido 1. Suplemento1: Desc1.',
        'deportes.deporte2.content': 'Contenido 2. Suplemento2: Desc2.',
        'deportes.card.suplementos': 'Suplementos'
      };
      return translations[key] || key;
    });

    renderDeportes();

    expect(screen.getByText('Deporte 1')).toBeInTheDocument();
    expect(screen.getByText('Deporte 2')).toBeInTheDocument();
    expect(screen.getByText('Contenido 1.')).toBeInTheDocument();
    expect(screen.getByText('Contenido 2.')).toBeInTheDocument();
  });

  it('incluye el Helmet con título y meta description correctos', () => {
    renderDeportes();

    // Verificar que el Helmet se renderiza (aunque no podemos verificar el contenido directamente)
    // El Helmet se renderiza internamente
    expect(document.title).toBe('Suplementos para Deportes - EGN Fitness');
  });
}); 