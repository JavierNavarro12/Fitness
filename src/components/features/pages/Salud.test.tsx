import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import Salud, { SaludCard } from './Salud';
import React from 'react';

// Mock de AOS
jest.mock('aos', () => ({
  init: jest.fn(),
  refresh: jest.fn(),
}));

// Mock de useTranslation
const mockT = jest.fn((key: string) => key);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: { changeLanguage: jest.fn() }
  }),
}));

// Mock de searchableContent
jest.mock('../../../data/content', () => ({
  searchableContent: [
    {
      id: 'salud1',
      title: 'salud.salud1.title',
      image: '/salud1.jpg',
      content: 'salud.salud1.content',
      category: 'salud'
    },
    {
      id: 'salud2',
      title: 'salud.salud2.title',
      image: '',
      content: 'salud.salud2.content',
      category: 'salud'
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

describe('SaludCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza SaludCard con imagen y puntos clave', () => {
    const mockContent = 'Intro. Punto1: Desc1. Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'salud-title') return 'Salud Title';
      if (key === 'salud.card.puntosClave') return 'Puntos Clave';
      if (key === mockContent) return mockContent;
      return key;
    });

    render(
      <HelmetProvider>
        <SaludCard
          id="test"
          title="salud-title"
          content={mockContent}
          image="/test.jpg"
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Salud Title')).toBeInTheDocument();
    expect(screen.getByText('Puntos Clave')).toBeInTheDocument();
    expect(screen.getByText('Intro.')).toBeInTheDocument();
    expect(screen.getByText('Punto1:')).toBeInTheDocument();
    expect(screen.getByText('Desc1')).toBeInTheDocument();
    expect(screen.getByText('Punto2:')).toBeInTheDocument();
    expect(screen.getByText('Desc2')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renderiza SaludCard sin imagen', () => {
    const mockContent = 'Intro. Punto1: Desc1.';
    mockT.mockImplementation((key: string) => {
      if (key === 'salud-title') return 'Salud Title';
      if (key === 'salud.card.puntosClave') return 'Puntos Clave';
      if (key === mockContent) return mockContent;
      return key;
    });

    render(
      <HelmetProvider>
        <SaludCard
          id="test"
          title="salud-title"
          content={mockContent}
          image=""
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Salud Title')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renderiza SaludCard con puntos clave mal formateados', () => {
    const mockContent = 'Intro. Punto1. Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'salud-title') return 'Salud Title';
      if (key === 'salud.card.puntosClave') return 'Puntos Clave';
      if (key === mockContent) return mockContent;
      return key;
    });

    render(
      <HelmetProvider>
        <SaludCard
          id="test"
          title="salud-title"
          content={mockContent}
          image="/test.jpg"
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Salud Title')).toBeInTheDocument();
    expect(screen.getByText('Intro.')).toBeInTheDocument();
    expect(screen.getByText('Punto2:')).toBeInTheDocument();
    expect(screen.getByText('Desc2')).toBeInTheDocument();
  });

  it('renderiza SaludCard con punto clave sin descripción', () => {
    const mockContent = 'Intro. Punto1: . Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'salud-title') return 'Salud Title';
      if (key === 'salud.card.puntosClave') return 'Puntos Clave';
      if (key === mockContent) return mockContent;
      return key;
    });

    render(
      <HelmetProvider>
        <SaludCard
          id="test"
          title="salud-title"
          content={mockContent}
          image="/test.jpg"
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Salud Title')).toBeInTheDocument();
    expect(screen.getByText('Intro.')).toBeInTheDocument();
  });
});

describe('Salud', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockT.mockImplementation((key: string) => key);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderSalud = (props = {}) => {
    const defaultProps = {
      itemToHighlight: null,
      onHighlightComplete: jest.fn(),
      ...props
    };

    return render(
      <BrowserRouter>
        <HelmetProvider>
          <Salud {...defaultProps} />
        </HelmetProvider>
      </BrowserRouter>
    );
  };

  it('renderiza el componente Salud correctamente', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'salud.title': 'Salud',
        'salud.description': 'Descripción de salud',
        'salud.stats.title': 'Estadísticas',
        'salud.stats.vitaminas': 'Vitaminas',
        'salud.stats.minerales': 'Minerales',
        'salud.stats.omega3': 'Omega 3',
        'salud.stats.antioxidantes': 'Antioxidantes',
        'salud.card.puntosClave': 'Puntos Clave'
      };
      return translations[key] || key;
    });

    renderSalud();

    expect(screen.getByText('Salud')).toBeInTheDocument();
    expect(screen.getByText('Descripción de salud')).toBeInTheDocument();
    expect(screen.getByText('Estadísticas')).toBeInTheDocument();
    expect(screen.getByText('Vitaminas')).toBeInTheDocument();
    expect(screen.getByText('Minerales')).toBeInTheDocument();
  });

  it('inicializa AOS en el useEffect', () => {
    const AOS = require('aos');
    renderSalud();

    expect(AOS.init).toHaveBeenCalledWith({ once: true });
    expect(AOS.refresh).toHaveBeenCalled();
  });

  it('maneja highlighting cuando itemToHighlight es válido', async () => {
    const onHighlightComplete = jest.fn();
    mockGetElementById.mockReturnValue(mockElement);

    renderSalud({
      itemToHighlight: { page: 'salud', id: 'salud1' },
      onHighlightComplete
    });

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('salud1');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    });

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(onHighlightComplete).toHaveBeenCalled();
    });
  });

  it('no ejecuta highlighting cuando itemToHighlight es null', () => {
    const onHighlightComplete = jest.fn();

    renderSalud({
      itemToHighlight: null,
      onHighlightComplete
    });

    expect(mockGetElementById).not.toHaveBeenCalled();
    expect(onHighlightComplete).not.toHaveBeenCalled();
  });

  it('no ejecuta highlighting cuando itemToHighlight.page no es salud', () => {
    const onHighlightComplete = jest.fn();

    renderSalud({
      itemToHighlight: { page: 'otra-pagina', id: 'salud1' },
      onHighlightComplete
    });

    expect(mockGetElementById).not.toHaveBeenCalled();
    expect(onHighlightComplete).not.toHaveBeenCalled();
  });

  it('maneja el caso cuando el elemento no se encuentra', async () => {
    const onHighlightComplete = jest.fn();
    mockGetElementById.mockReturnValue(null);

    renderSalud({
      itemToHighlight: { page: 'salud', id: 'elemento-inexistente' },
      onHighlightComplete
    });

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('elemento-inexistente');
      expect(onHighlightComplete).toHaveBeenCalled();
    });
  });

  it('renderiza los datos de salud desde searchableContent', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'salud.salud1.title': 'Salud 1',
        'salud.salud2.title': 'Salud 2',
        'salud.salud1.content': 'Intro. Punto1: Desc1.',
        'salud.salud2.content': 'Intro2. Punto2: Desc2.',
        'salud.card.puntosClave': 'Puntos Clave'
      };
      return translations[key] || key;
    });

    renderSalud();

    expect(screen.getByText('Salud 1')).toBeInTheDocument();
    expect(screen.getByText('Salud 2')).toBeInTheDocument();
    expect(screen.getByText('Intro.')).toBeInTheDocument();
    expect(screen.getByText('Intro2.')).toBeInTheDocument();
  });

  it('incluye el Helmet con título y meta description correctos', () => {
    renderSalud();
    expect(document.title).toBe('Suplementos para Salud y Bienestar - EGN Fitness');
  });
}); 