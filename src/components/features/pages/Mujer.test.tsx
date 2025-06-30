import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import Mujer, { MujerCard } from './Mujer';
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
      id: 'mujer1',
      title: 'mujer.mujer1.title',
      image: '/mujer1.jpg',
      content: 'mujer.mujer1.content',
      category: 'mujer'
    },
    {
      id: 'mujer2',
      title: 'mujer.mujer2.title',
      image: '',
      content: 'mujer.mujer2.content',
      category: 'mujer'
    },
    {
      id: 'fundamentos',
      title: 'mujer.fundamentos.title',
      image: '/fundamentos.jpg',
      content: 'Fundamentos: Descripción de fundamentos.',
      category: 'mujer'
    },
    {
      id: 'equilibrio',
      title: 'mujer.equilibrio.title',
      image: '/equilibrio.jpg',
      content: 'Equilibrio: Descripción de equilibrio.',
      category: 'mujer'
    },
    {
      id: 'escucha',
      title: 'mujer.escucha.title',
      image: '/escucha.jpg',
      content: 'Escucha: Descripción de escucha.',
      category: 'mujer'
    },
    {
      id: 'osea',
      title: 'mujer.osea.title',
      image: '/osea.jpg',
      content: 'Ósea: Descripción de ósea.',
      category: 'mujer'
    },
    {
      id: 'belleza',
      title: 'mujer.belleza.title',
      image: '/belleza.jpg',
      content: 'Belleza: Descripción de belleza.',
      category: 'mujer'
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

describe('MujerCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza MujerCard con imagen, puntos clave y un icono', () => {
    const mockContent = 'Punto1: Desc1. Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'mujer-title') return 'Mujer Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <MujerCard
          id="test"
          title="mujer-title"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Mujer Title')).toBeInTheDocument();
    expect(screen.getByText('Punto1:')).toBeInTheDocument();
    expect(screen.getByText('Desc1')).toBeInTheDocument();
    expect(screen.getByText('Punto2:')).toBeInTheDocument();
    expect(screen.getByText('Desc2')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renderiza MujerCard sin imagen', () => {
    const mockContent = 'Punto1: Desc1.';
    mockT.mockImplementation((key: string) => {
      if (key === 'mujer-title') return 'Mujer Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <MujerCard
          id="test"
          title="mujer-title"
          content={mockContent}
          image=""
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Mujer Title')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renderiza MujerCard con puntos clave mal formateados', () => {
    const mockContent = 'Punto1. Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'mujer-title') return 'Mujer Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <MujerCard
          id="test"
          title="mujer-title"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Mujer Title')).toBeInTheDocument();
    expect(screen.getByText('Punto2:')).toBeInTheDocument();
    expect(screen.getByText('Desc2')).toBeInTheDocument();
  });

  it('renderiza MujerCard con punto clave sin descripción', () => {
    const mockContent = 'Punto1: . Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'mujer-title') return 'Mujer Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <MujerCard
          id="test"
          title="mujer-title"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Mujer Title')).toBeInTheDocument();
  });

  it('renderiza MujerCard con contenido plano (sin puntos clave)', () => {
    const mockContent = 'Solo texto plano sin puntos clave.';
    mockT.mockImplementation((key: string) => {
      if (key === 'mujer-title') return 'Mujer Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <MujerCard
          id="test"
          title="mujer-title"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Solo texto plano sin puntos clave.')).toBeInTheDocument();
  });
});

describe('Mujer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockT.mockImplementation((key: string) => key);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderMujer = (props = {}) => {
    const defaultProps = {
      itemToHighlight: null,
      onHighlightComplete: jest.fn(),
      ...props
    };

    return render(
      <BrowserRouter>
        <HelmetProvider>
          <Mujer {...defaultProps} />
        </HelmetProvider>
      </BrowserRouter>
    );
  };

  it('renderiza el componente Mujer correctamente', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'mujer.title': 'Mujer',
        'mujer.description': 'Descripción de mujer',
        'mujer.stats.title': 'Estadísticas',
        'mujer.stats.hormonal': 'Hormonal',
        'mujer.stats.piel': 'Piel',
        'mujer.stats.ciclo': 'Ciclo',
        'mujer.stats.fundamentos': 'Fundamentos',
        'mujer.stats.equilibrio': 'Equilibrio',
        'mujer.stats.escucha': 'Escucha',
        'mujer.integral.title': 'Integral',
        'mujer.osea-belleza.title': 'Ósea y Belleza',
      };
      return translations[key] || key;
    });

    renderMujer();

    expect(screen.getByText('Mujer')).toBeInTheDocument();
    expect(screen.getByText('Descripción de mujer')).toBeInTheDocument();
    expect(screen.getByText('Estadísticas')).toBeInTheDocument();
    expect(screen.getByText('Fundamentos')).toBeInTheDocument();
    expect(screen.getByText('Equilibrio')).toBeInTheDocument();
    expect(screen.getByText('Escucha')).toBeInTheDocument();
    expect(screen.getByText('Integral')).toBeInTheDocument();
    expect(screen.getByText('Ósea y Belleza')).toBeInTheDocument();
  });

  it('inicializa AOS en el useEffect', () => {
    const AOS = require('aos');
    renderMujer();

    expect(AOS.init).toHaveBeenCalledWith({ once: true });
    expect(AOS.refresh).toHaveBeenCalled();
  });

  it('maneja highlighting cuando itemToHighlight es válido', async () => {
    const onHighlightComplete = jest.fn();
    mockGetElementById.mockReturnValue(mockElement);

    renderMujer({
      itemToHighlight: { page: 'mujer', id: 'mujer1' },
      onHighlightComplete
    });

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('mujer1');
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

    renderMujer({
      itemToHighlight: null,
      onHighlightComplete
    });

    expect(mockGetElementById).not.toHaveBeenCalled();
    expect(onHighlightComplete).not.toHaveBeenCalled();
  });

  it('no ejecuta highlighting cuando itemToHighlight.page no es mujer', () => {
    const onHighlightComplete = jest.fn();

    renderMujer({
      itemToHighlight: { page: 'otra-pagina', id: 'mujer1' },
      onHighlightComplete
    });

    expect(mockGetElementById).not.toHaveBeenCalled();
    expect(onHighlightComplete).not.toHaveBeenCalled();
  });

  it('maneja el caso cuando el elemento no se encuentra', async () => {
    const onHighlightComplete = jest.fn();
    mockGetElementById.mockReturnValue(null);

    renderMujer({
      itemToHighlight: { page: 'mujer', id: 'elemento-inexistente' },
      onHighlightComplete
    });

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('elemento-inexistente');
      expect(onHighlightComplete).toHaveBeenCalled();
    });
  });

  it('incluye el Helmet con título y meta description correctos', () => {
    renderMujer();
    expect(document.title).toBe('Suplementación para la Mujer - EGN Fitness');
  });

  it('renderiza MujerCard con datos filtrados', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'mujer.title': 'Mujer',
        'mujer.description': 'Descripción de mujer',
        'mujer.stats.title': 'Estadísticas',
        'mujer.stats.fundamentos': 'Fundamentos',
        'mujer.stats.equilibrio': 'Equilibrio',
        'mujer.stats.escucha': 'Escucha',
        'mujer.integral.title': 'Integral',
        'mujer.osea-belleza.title': 'Ósea y Belleza',
        'mujer.fundamentos.title': 'Fundamentos',
        'mujer.equilibrio.title': 'Equilibrio',
        'mujer.escucha.title': 'Escucha',
        'mujer.osea.title': 'Ósea',
        'mujer.belleza.title': 'Belleza',
        'Fundamentos: Descripción de fundamentos.': 'Fundamentos: Descripción de fundamentos.',
        'Equilibrio: Descripción de equilibrio.': 'Equilibrio: Descripción de equilibrio.',
        'Escucha: Descripción de escucha.': 'Escucha: Descripción de escucha.',
        'Ósea: Descripción de ósea.': 'Ósea: Descripción de ósea.',
        'Belleza: Descripción de belleza.': 'Belleza: Descripción de belleza.',
      };
      return translations[key] || key;
    });

    renderMujer();

    // Verificar que se renderizan los cards de la sección integral
    expect(screen.getAllByText('Fundamentos').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Equilibrio').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Escucha').length).toBeGreaterThan(1);
    
    // Verificar que se renderizan los cards de la sección ósea y belleza
    expect(screen.getByText('Ósea')).toBeInTheDocument();
    expect(screen.getByText('Belleza')).toBeInTheDocument();
  });
}); 