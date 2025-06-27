import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportAccordionList from './ReportAccordionList';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'report.title': 'Informe Personalizado',
        'report.copy': 'Copiar',
        'report.copied': 'Copiado',
        'report.downloadPDF': 'Descargar PDF',
        'report.generatingPDF': 'Generando PDF...',
        'report.delete': 'Eliminar',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock de react-markdown
jest.mock('react-markdown', () => {
  return ({ children }: { children: string }) => <div data-testid="markdown-content">{children}</div>;
});

// Mock de react-icons
jest.mock('react-icons/fa6', () => ({
  FaFile: ({ className }: { className?: string }) => <div data-testid="fa-file" className={className}>📄</div>,
  FaRegCopy: () => <div data-testid="fa-copy">📋</div>,
  FaCircleCheck: ({ className }: { className?: string }) => <div data-testid="fa-check" className={className}>✅</div>,
  FaDownload: ({ className }: { className?: string }) => <div data-testid="fa-download" className={className}>⬇️</div>,
  FaTrash: ({ className }: { className?: string }) => <div data-testid="fa-trash" className={className}>🗑️</div>,
  FaChevronDown: ({ className }: { className?: string }) => <div data-testid="fa-chevron-down" className={className}>⬇️</div>,
  FaChevronUp: ({ className }: { className?: string }) => <div data-testid="fa-chevron-up" className={className}>⬆️</div>,
}));

// Mock de @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: ({ children, fileName }: { children: any; fileName: string }) => (
    <a href="#" data-testid="pdf-download-link" data-filename={fileName}>
      {children}
    </a>
  ),
}));

// Mock de ReportView
jest.mock('./ReportView', () => {
  return ({ report, onDelete }: { report: any; onDelete?: any }) => (
    <div data-testid="report-view" data-report-id={report.id}>
      <div>Desktop Report View</div>
      <div>{report.content}</div>
    </div>
  );
});

// Mock de ReportPDF
jest.mock('./ReportPDF', () => {
  return ({ title, content, supplements, date }: { title: string; content: string; supplements: any[]; date?: string }) => (
    <div data-testid="report-pdf" data-title={title} data-date={date}>
      PDF Document
    </div>
  );
});

// Mock de navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock de window.confirm
Object.assign(window, {
  confirm: jest.fn(),
});

describe('ReportAccordionList Component', () => {
  const mockReports = [
    {
      id: 'report-1',
      content: `# Informe Personalizado

## Perfil Físico:
- Peso: 75kg
- Altura: 180cm
- Edad: 25 años

## Suplementación Recomendada:
- **Proteína Whey Isolate**: Para recuperación muscular
- **Creatina Monohidrato**: Para fuerza y potencia
- **BCAAs**: Para reducir fatiga muscular

## Recomendaciones de Entrenamiento:
Entrenamiento de fuerza 3-4 veces por semana.`,
      createdAt: '2024-01-15T10:30:00Z',
      userId: 'user-123',
    },
    {
      id: 'report-2',
      content: `# Informe Personalizado 2

## Nutrición:
Mantener una dieta equilibrada con proteínas, carbohidratos y grasas saludables.

## Consejos:
Descansar adecuadamente entre entrenamientos.`,
      createdAt: '2024-01-16T10:30:00Z',
      userId: 'user-123',
    },
  ];

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders mobile view with accordion cards', () => {
    render(<ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />);

    // Verificar que se renderizan las tarjetas móviles
    expect(screen.getAllByText('Informe Personalizado')).toHaveLength(2);
    expect(screen.getAllByTestId('fa-chevron-down')).toHaveLength(2);
  });

  test('renders desktop view with full reports', () => {
    render(<ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />);

    // Verificar que se renderizan las vistas de escritorio
    expect(screen.getAllByTestId('report-view')).toHaveLength(2);
  });

  test('expands and collapses report cards on mobile', async () => {
    render(<ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />);

    const firstReportCard = screen.getAllByText('Informe Personalizado')[0].closest('div');
    expect(firstReportCard).toBeInTheDocument();

    // Inicialmente colapsado
    expect(screen.getAllByTestId('fa-chevron-down')[0]).toBeInTheDocument();

    // Hacer clic para expandir
    await userEvent.click(firstReportCard!);

    // Verificar que se expande
    expect(screen.getAllByTestId('fa-chevron-up')[0]).toBeInTheDocument();
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();

    // Hacer clic para colapsar
    await userEvent.click(firstReportCard!);

    // Verificar que se colapsa
    expect(screen.getAllByTestId('fa-chevron-down')[0]).toBeInTheDocument();
  });

  test('shows excerpt when collapsed', () => {
    render(<ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />);

    // Verificar que se muestra el extracto en las tarjetas colapsadas
    const excerptElements = screen.getAllByText(/Entrenamiento de fuerza/);
    expect(excerptElements.length).toBeGreaterThan(0);
  });

  test('handles copy functionality in mobile view', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockImplementation(() => Promise.resolve());
    
    render(<ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />);

    // Expandir el primer reporte
    const firstReportCard = screen.getAllByText('Informe Personalizado')[0].closest('div');
    await userEvent.click(firstReportCard!);

    // Hacer clic en el botón de copiar
    const copyButton = screen.getAllByTitle('Copiar')[0];
    await userEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockReports[0].content);

    // Verificar que aparece el icono de check
    expect(await screen.findByTestId('fa-check')).toBeInTheDocument();
  });

  test('handles delete functionality in mobile view', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    
    render(<ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />);

    // Expandir el primer reporte
    const firstReportCard = screen.getAllByText('Informe Personalizado')[0].closest('div');
    await userEvent.click(firstReportCard!);

    // Hacer clic en el botón de eliminar
    const deleteButton = screen.getAllByTitle('Eliminar')[0];
    await userEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('¿Seguro que quieres eliminar este informe?');
    expect(mockOnDelete).toHaveBeenCalledWith('report-1');
  });

  test('does not delete when user cancels confirmation', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    render(<ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />);

    // Expandir el primer reporte
    const firstReportCard = screen.getAllByText('Informe Personalizado')[0].closest('div');
    await userEvent.click(firstReportCard!);

    // Hacer clic en el botón de eliminar
    const deleteButton = screen.getAllByTitle('Eliminar')[0];
    await userEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('¿Seguro que quieres eliminar este informe?');
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('handles reports without ID gracefully', () => {
    const reportsWithoutId = [
      {
        id: undefined,
        content: 'Test content',
        createdAt: '2024-01-15T10:30:00Z',
        userId: 'user-123',
      },
    ];

    render(<ReportAccordionList reports={reportsWithoutId} onDelete={mockOnDelete} />);

    // Verificar que se renderiza sin errores
    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();
  });

  test('handles empty reports array', () => {
    render(<ReportAccordionList reports={[]} onDelete={mockOnDelete} />);

    // Verificar que no se renderiza nada en móvil
    expect(screen.queryByText('Informe Personalizado')).not.toBeInTheDocument();
    
    // Verificar que no se renderiza nada en escritorio
    expect(screen.queryByTestId('report-view')).not.toBeInTheDocument();
  });

  test('prevents event propagation on action buttons', async () => {
    render(<ReportAccordionList reports={mockReports} onDelete={mockOnDelete} />);

    // Expandir el primer reporte
    const firstReportCard = screen.getAllByText('Informe Personalizado')[0].closest('div');
    await userEvent.click(firstReportCard!);

    // Hacer clic en el botón de copiar
    const copyButton = screen.getAllByTitle('Copiar')[0];
    await userEvent.click(copyButton);

    // Verificar que el reporte permanece expandido
    expect(screen.getAllByTestId('fa-chevron-up')[0]).toBeInTheDocument();
  });
});

export {}; 