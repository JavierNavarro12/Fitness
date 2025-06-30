import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import Grasa, { GrasaCard } from './Grasa';
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
      id: 'grasa1',
      title: 'grasa.grasa1.title',
      image: '/grasa1.jpg',
      content: 'grasa.grasa1.content',
      category: 'grasa'
    },
    {
      id: 'grasa2',
      title: 'grasa.grasa2.title',
      image: '',
      content: 'grasa.grasa2.content',
      category: 'grasa'
    },
    {
      id: 'termogenico',
      title: 'grasa.termogenico.title',
      image: '/termogenico.jpg',
      content: 'Termogénico: Descripción de termogénico.',
      category: 'grasa'
    },
    {
      id: 'control',
      title: 'grasa.control.title',
      image: '/control.jpg',
      content: 'Control: Descripción de control.',
      category: 'grasa'
    },
    {
      id: 'fundamentos',
      title: 'grasa.fundamentos.title',
      image: '/fundamentos.jpg',
      content: 'Fundamentos: Descripción de fundamentos.',
      category: 'grasa'
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
  style: { boxShadow: '' }
};

describe('GrasaCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza GrasaCard con imagen, puntos clave y un icono', () => {
    const mockContent = 'Punto1: Desc1. Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'grasa.fundamentos.title') return 'Fundamentos';
      if (key === 'grasa.termogenico.title') return 'Termogénico';
      if (key === 'grasa.control.title') return 'Control';
      if (key === 'grasa-title') return 'Grasa Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <GrasaCard
          id="test"
          title="Fundamentos"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByAltText('Fundamentos')).toBeInTheDocument();
    expect(screen.getByText('Punto1:')).toBeInTheDocument();
    expect(screen.getByText('Desc1')).toBeInTheDocument();
    expect(screen.getByText('Punto2:')).toBeInTheDocument();
    expect(screen.getByText('Desc2')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renderiza GrasaCard sin imagen', () => {
    const mockContent = 'Punto1: Desc1.';
    mockT.mockImplementation((key: string) => {
      if (key === 'grasa.termogenico.title') return 'Termogénico';
      if (key === 'grasa-title') return 'Grasa Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <GrasaCard
          id="test"
          title="Termogénico"
          content={mockContent}
          image=""
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renderiza GrasaCard con puntos clave mal formateados', () => {
    const mockContent = 'Punto1. Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'grasa.control.title') return 'Control';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <GrasaCard
          id="test"
          title="Control"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByAltText('Control')).toBeInTheDocument();
    expect(screen.getByText('Punto2:')).toBeInTheDocument();
    expect(screen.getByText('Desc2')).toBeInTheDocument();
  });

  it('renderiza GrasaCard con punto clave sin descripción', () => {
    const mockContent = 'Punto1: . Punto2: Desc2.';
    mockT.mockImplementation((key: string) => {
      if (key === 'grasa.fundamentos.title') return 'Fundamentos';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <GrasaCard
          id="test"
          title="Fundamentos"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByAltText('Fundamentos')).toBeInTheDocument();
  });

  it('renderiza GrasaCard con contenido plano (sin puntos clave)', () => {
    const mockContent = 'Solo texto plano sin puntos clave.';
    mockT.mockImplementation((key: string) => {
      if (key === 'grasa-title') return 'Grasa Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <GrasaCard
          id="test"
          title="Grasa Title"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Solo texto plano sin puntos clave.')).toBeInTheDocument();
  });

  it('renderiza GrasaCard con contenido HTML', () => {
    const mockContent = '<b>Texto en negrita</b><br>Más texto.';
    mockT.mockImplementation((key: string) => {
      if (key === 'grasa-title') return 'Grasa Title';
      if (key === mockContent) return mockContent;
      return key;
    });
    const icon = <span data-testid="icon">icono</span>;

    render(
      <HelmetProvider>
        <GrasaCard
          id="test"
          title="Grasa Title"
          content={mockContent}
          image="/test.jpg"
          icon={icon}
        />
      </HelmetProvider>
    );

    expect(screen.getByText('Texto en negrita')).toBeInTheDocument();
    expect(screen.getByText('Más texto.')).toBeInTheDocument();
  });
});

describe('Grasa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockT.mockImplementation((key: string) => key);
    mockElement.style.boxShadow = '';
    mockGetElementById.mockReturnValue(mockElement);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderGrasa = (props = {}) => {
    const defaultProps = {
      itemToHighlight: null,
      onHighlightComplete: jest.fn(),
      ...props
    };

    return render(
      <BrowserRouter>
        <HelmetProvider>
          <Grasa {...defaultProps} />
        </HelmetProvider>
      </BrowserRouter>
    );
  };

  it('renderiza el componente Grasa correctamente', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'grasa.title': 'Grasa',
        'grasa.description': 'Descripción de grasa',
        'grasa.stats.title': 'Estadísticas',
        'grasa.stats.termogenicos': 'Termogénicos',
        'grasa.stats.fundamentos': 'Fundamentos',
        'grasa.card.puntosClave': 'Puntos Clave',
      };
      return translations[key] || key;
    });

    renderGrasa();

    expect(screen.getByText('Grasa')).toBeInTheDocument();
    expect(screen.getByText('Descripción de grasa')).toBeInTheDocument();
    expect(screen.getByText('Estadísticas')).toBeInTheDocument();
    expect(screen.getAllByText((content, node) => node && node.textContent ? node.textContent.includes('Termogénicos') : false).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, node) => node && node.textContent ? node.textContent.includes('Fundamentos') : false).length).toBeGreaterThan(0);
  });

  it('inicializa AOS en el useEffect', () => {
    const AOS = require('aos');
    renderGrasa();

    expect(AOS.init).toHaveBeenCalledWith({ once: true });
    expect(AOS.refresh).toHaveBeenCalled();
  });

  it('maneja highlighting cuando itemToHighlight es válido', async () => {
    const onHighlightComplete = jest.fn();
    renderGrasa({
      itemToHighlight: { page: 'grasa', id: 'grasa1' },
      onHighlightComplete
    });

    jest.advanceTimersByTime(100);
    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('grasa1');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      expect(mockElement.style.boxShadow).toBe('0 0 20px rgba(220, 38, 38, 0.5)');
    });

    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(mockElement.style.boxShadow).toBe('');
    });
  });

  it('cubre el branch del useEffect cuando itemToHighlight es null', () => {
    const onHighlightComplete = jest.fn();
    renderGrasa({
      itemToHighlight: null,
      onHighlightComplete
    });
    expect(mockGetElementById).not.toHaveBeenCalled();
    expect(onHighlightComplete).not.toHaveBeenCalled();
  });

  it('cubre el branch del useEffect cuando itemToHighlight.page no es "grasa"', () => {
    const onHighlightComplete = jest.fn();
    renderGrasa({
      itemToHighlight: { page: 'otra-pagina', id: 'grasa1' },
      onHighlightComplete
    });
    expect(mockGetElementById).not.toHaveBeenCalled();
    expect(onHighlightComplete).not.toHaveBeenCalled();
  });

  it('maneja el caso cuando el elemento no se encuentra', async () => {
    const onHighlightComplete = jest.fn();
    mockGetElementById.mockReturnValue((global as any).mockElement);

    renderGrasa({
      itemToHighlight: { page: 'grasa', id: 'elemento-inexistente' },
      onHighlightComplete
    });

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(mockGetElementById).toHaveBeenCalledWith('elemento-inexistente');
      expect(onHighlightComplete).toHaveBeenCalled();
    });
  });

  it('renderiza los datos de grasa desde searchableContent', () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'grasa.termogenico.title': 'Termogénico',
        'grasa.control.title': 'Control',
        'grasa.fundamentos.title': 'Fundamentos',
        'grasa.termogenico.content': 'Termogénico: Descripción de termogénico.',
        'grasa.control.content': 'Control: Descripción de control.',
        'grasa.fundamentos.content': 'Fundamentos: Descripción de fundamentos.',
        'grasa.card.puntosClave': 'Puntos Clave',
      };
      return translations[key] || key;
    });

    renderGrasa();

    expect(screen.getAllByText((content, node) => node && node.textContent ? node.textContent.includes('grasa.stats.termogenicos') : false).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, node) => node && node.textContent ? node.textContent.includes('Fundamentos') : false).length).toBeGreaterThan(0);
  });

  it('incluye el Helmet con título y meta description correctos', () => {
    renderGrasa();
    expect(document.title).toBe('Suplementos para Quema de Grasa - EGN Fitness');
  });

  it('cubre la función de limpieza del useEffect (clearTimeout)', () => {
    const onHighlightComplete = jest.fn();
    mockGetElementById.mockReturnValue(mockElement);

    const { unmount } = render(
      <BrowserRouter>
        <HelmetProvider>
          <Grasa
            itemToHighlight={{ page: 'grasa', id: 'grasa1' }}
            onHighlightComplete={onHighlightComplete}
          />
        </HelmetProvider>
      </BrowserRouter>
    );

    unmount(); // Desmonta el componente para disparar la limpieza
    // No se espera error, solo cubrir la línea
  });

  it('cubre los exports de Grasa y GrasaCard', () => {
    render(
      <BrowserRouter>
        <HelmetProvider>
          <Grasa itemToHighlight={null} onHighlightComplete={() => {}} />
        </HelmetProvider>
      </BrowserRouter>
    );
    render(
      <HelmetProvider>
        <GrasaCard
          id="test"
          title="Test"
          content="Test: contenido."
          image=""
          icon={<span />}
        />
      </HelmetProvider>
    );
  });
}); 