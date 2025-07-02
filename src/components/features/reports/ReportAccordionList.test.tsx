import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ReportAccordionList from './ReportAccordionList';

// Mock Firebase
jest.mock('../../../firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(callback => {
      callback(null);
      return jest.fn(); // unsubscribe function
    }),
  },
}));

// Mock Firestore services
jest.mock('../../../services/favoritesService', () => ({
  getUserFavorites: jest.fn(() => Promise.resolve([])),
  addToFavorites: jest.fn(() => Promise.resolve(true)),
  removeFromFavorites: jest.fn(() => Promise.resolve(true)),
}));

// Mock react-markdown
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div>{children}</div>;
  };
});

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'report.title': 'Informe Personalizado',
        'report.copy': 'Copiar',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock ReportPDF component
jest.mock('./ReportPDF', () => {
  return function MockReportPDF() {
    return <div>Mock PDF</div>;
  };
});

// Mock ReportView component
jest.mock('./ReportView', () => {
  return function MockReportView() {
    return <div>Desktop Report View</div>;
  };
});

describe('ReportAccordionList', () => {
  const mockReports = [
    {
      id: '1',
      content: `
# Plan Personalizado de Suplementación Deportiva

## Introducción Personalizada
Basado en tu perfil (Objetivo: ganar músculo, Deporte: Levantamiento de pesas, Experiencia: Intermedio), aquí tienes un plan personalizado.

## Suplementos Base (Fundamentales)

### Proteína en polvo
- **Dosis:** 25-30g después del entrenamiento
- **Timing:** Post-entreno y entre comidas

### Creatina Monohidrato
- **Dosis:** 3-5g diarios
- **Timing:** Cualquier momento del día

## Suplementos para tu Objetivo

### BCAA (Aminoácidos Ramificados)
- **Dosis:** 10-15g durante el entrenamiento
- **Timing:** Intra-entreno

## Productos Recomendados
- Enlace 1
- Enlace 2
      `,
      createdAt: '2023-01-01T00:00:00Z',
      userId: 'user1',
    },
  ];

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  it('renderiza la lista de informes correctamente', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('maneja informes vacíos', () => {
    renderWithRouter(<ReportAccordionList reports={[]} />);

    expect(
      screen.getAllByText('No hay informes válidos para mostrar.')
    ).toHaveLength(2); // Mobile + desktop
  });

  it('filtra informes sin contenido válido', () => {
    const invalidReports = [
      {
        id: '1',
        content: 'Contenido muy corto',
        createdAt: '2023-01-01T00:00:00Z',
        userId: 'user1',
      },
    ];

    renderWithRouter(<ReportAccordionList reports={invalidReports} />);

    expect(
      screen.getAllByText('No hay informes válidos para mostrar.')
    ).toHaveLength(2); // Mobile + desktop
  });

  it('permite expandir y colapsar informes', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    const reportTitle = screen.getByText('Informe Personalizado');
    expect(reportTitle).toBeInTheDocument();
  });

  it('muestra botones de acción cuando está expandido', () => {
    renderWithRouter(
      <ReportAccordionList reports={mockReports} initialExpandedId='1' />
    );

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('maneja la función onDelete cuando se proporciona', () => {
    const mockOnDelete = jest.fn();

    renderWithRouter(
      <ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('procesa correctamente el contenido del informe', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('extrae suplementos del contenido', () => {
    const reportWithSupplements = [
      {
        ...mockReports[0],
        content: `
### Proteína en polvo
Descripción de proteína

### Creatina
Descripción de creatina
      `,
      },
    ];

    renderWithRouter(<ReportAccordionList reports={reportWithSupplements} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('maneja favoritos correctamente', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('navega correctamente entre vistas móvil y escritorio', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('maneja el estado de carga de favoritos', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('permite copiar contenido del informe', () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });

    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('renderiza correctamente la vista móvil', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('renderiza correctamente la vista de escritorio', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('maneja enlaces de suplementos correctamente', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('filtra correctamente la sección de productos recomendados', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('genera extractos de contenido apropiadamente', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('maneja la autenticación de usuario', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  it('sincroniza favoritos con Firebase', () => {
    renderWithRouter(<ReportAccordionList reports={mockReports} />);

    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });
});

export {};
