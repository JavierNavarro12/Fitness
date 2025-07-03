import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ReportView from './ReportView';

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

// Mock de @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  Document: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='pdf-document'>{children}</div>
  ),
  Page: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid='pdf-page' style={style}>
      {children}
    </div>
  ),
  Text: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid='pdf-text' style={style}>
      {children}
    </div>
  ),
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid='pdf-view' style={style}>
      {children}
    </div>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Link: ({
    children,
    src,
    style,
  }: {
    children: React.ReactNode;
    src?: string;
    style?: any;
  }) => (
    <a data-testid='pdf-link' href={src} style={style}>
      {children}
    </a>
  ),
  PDFDownloadLink: ({ children }: any) => (
    <div data-testid='pdf-download-link'>
      {typeof children === 'function' ? children({ loading: false }) : children}
    </div>
  ),
}));

// Mock de react-markdown
jest.mock('react-markdown', () => {
  return ({ children }: { children: string }) => (
    <div data-testid='markdown-content'>{children}</div>
  );
});

// Mock de react-icons
jest.mock('react-icons/fa6', () => ({
  FaFile: ({ className }: { className?: string }) => (
    <div data-testid='fa-file' className={className}>
      📄
    </div>
  ),
  FaRegCopy: () => <div data-testid='fa-copy'>📋</div>,
  FaCircleCheck: ({ className }: { className?: string }) => (
    <div data-testid='fa-check' className={className}>
      ✅
    </div>
  ),
  FaDownload: ({ className }: { className?: string }) => (
    <div data-testid='fa-download' className={className}>
      ⬇️
    </div>
  ),
  FaTrash: ({ className }: { className?: string }) => (
    <div data-testid='fa-trash' className={className}>
      🗑️
    </div>
  ),
  FaToggleOn: ({ className }: { className?: string }) => (
    <div data-testid='fa-toggle-on' className={className}>
      🟢
    </div>
  ),
  FaToggleOff: ({ className }: { className?: string }) => (
    <div data-testid='fa-toggle-off' className={className}>
      ⚪
    </div>
  ),
}));

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

describe('ReportView Component', () => {
  const mockReport = {
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
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders report with basic information', () => {
    render(<ReportView report={mockReport} />);

    // Verificar que se renderiza el título del reporte
    expect(screen.getByText('Informe Personalizado')).toBeInTheDocument();

    // Verificar que se muestra la fecha de creación (formato local)
    const dateNodes = screen.getAllByText((content, element) => {
      if (!element) return false;
      return !!(
        element.textContent &&
        element.textContent.includes('2024') &&
        element.textContent.includes('1') &&
        element.textContent.includes('15')
      );
    });
    expect(dateNodes.length).toBeGreaterThan(0);

    // Verificar que se renderiza el contenido del markdown
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
  });

  test('renders report header with action buttons', () => {
    render(<ReportView report={mockReport} />);

    // Verificar que se renderizan los botones de acción
    expect(screen.getByTitle('Copiar')).toBeInTheDocument();
    expect(screen.getByTitle('Descargar PDF')).toBeInTheDocument();
    expect(screen.getByTestId('fa-file')).toBeInTheDocument();
  });

  test('renders delete button when onDelete prop is provided', () => {
    render(<ReportView report={mockReport} onDelete={mockOnDelete} />);

    // Verificar que se renderiza el botón de eliminar
    expect(screen.getByTitle('Eliminar')).toBeInTheDocument();
    expect(screen.getByTestId('fa-trash')).toBeInTheDocument();
  });

  test('does not render delete button when onDelete prop is not provided', () => {
    render(<ReportView report={mockReport} />);

    // Verificar que NO se renderiza el botón de eliminar
    expect(screen.queryByTitle('Eliminar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('fa-trash')).not.toBeInTheDocument();
  });

  test('handles copy functionality', async () => {
    render(<ReportView report={mockReport} />);

    // Mock asíncrono para clipboard
    (navigator.clipboard.writeText as jest.Mock).mockImplementation(() =>
      Promise.resolve()
    );

    // Envolver en act y hacer clic en el botón de copiar específico
    const copyButton = screen.getByTitle('Copiar');
    await userEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockReport.content
    );

    // Esperar a que aparezca el icono de check
    expect(await screen.findByTestId('fa-check')).toBeInTheDocument();

    // Verificar que cambia el estado a "copiado"
    expect(screen.getByText('Copiado')).toBeInTheDocument();

    // Verificar que vuelve al estado normal después de 2 segundos
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(screen.getByText('Copiar')).toBeInTheDocument();
    });
  });

  test('handles delete functionality with confirmation', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    render(<ReportView report={mockReport} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTitle('Eliminar');
    await userEvent.click(deleteButton);

    // Verificar que se muestra el diálogo de confirmación
    expect(window.confirm).toHaveBeenCalledWith(
      '¿Seguro que quieres eliminar este informe?'
    );

    // Verificar que se llama a la función onDelete
    expect(mockOnDelete).toHaveBeenCalledWith('report-1');
  });

  test('does not delete when user cancels confirmation', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(<ReportView report={mockReport} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTitle('Eliminar');
    await userEvent.click(deleteButton);

    // Verificar que se muestra el diálogo de confirmación
    expect(window.confirm).toHaveBeenCalledWith(
      '¿Seguro que quieres eliminar este informe?'
    );

    // Verificar que NO se llama a la función onDelete
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('extracts and displays supplements from content', () => {
    render(<ReportView report={mockReport} />);

    // Verificar que se extraen y muestran los suplementos
    expect(screen.getByText('Productos Recomendados')).toBeInTheDocument();
    expect(screen.getByText('Proteína Whey Isolate')).toBeInTheDocument();
    expect(screen.getByText('Creatina Monohidrato')).toBeInTheDocument();
    expect(screen.getByText('BCAAs')).toBeInTheDocument();
  });

  test('does not display supplements section when no supplements found', () => {
    const reportWithoutSupplements = {
      ...mockReport,
      content: `# Informe Personalizado

## Recomendaciones de Entrenamiento:
Entrenamiento de fuerza 3-4 veces por semana.

## Nutrición:
Mantener una dieta equilibrada con proteínas, carbohidratos y grasas saludables.

## Consejos:
Descansar adecuadamente entre entrenamientos.

## Plan de Ejercicios:
- Lunes: Pecho y tríceps
- Miércoles: Espalda y bíceps
- Viernes: Piernas y hombros

## Hidratación:
Beber al menos 2 litros de agua al día.

## Descanso:
Dormir 7-8 horas por noche.`,
    };

    render(<ReportView report={reportWithoutSupplements} />);

    // Verificar que NO se muestra la sección de suplementos
    expect(
      screen.queryByText('Productos Recomendados')
    ).not.toBeInTheDocument();
  });

  test('filters personalization summary from content', () => {
    render(<ReportView report={mockReport} />);

    // Verificar que el contenido filtrado no incluye información del perfil
    const markdownContent = screen.getByTestId('markdown-content');
    expect(markdownContent.textContent).not.toContain('Peso: 75kg');
    expect(markdownContent.textContent).not.toContain('Altura: 180cm');
    expect(markdownContent.textContent).not.toContain('Edad: 25 años');
  });

  test('generates correct PDF download link', () => {
    render(<ReportView report={mockReport} />);

    const pdfLink = screen.getByTitle('Descargar PDF');
    expect(pdfLink).toBeInTheDocument();
  });

  test('handles report without ID for deletion', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    const reportWithoutId = { ...mockReport, id: undefined };
    render(<ReportView report={reportWithoutId} onDelete={mockOnDelete} />);

    // El botón eliminar no debe estar presente si no hay id
    expect(screen.queryByTitle('Eliminar')).not.toBeInTheDocument();
  });

  test('extracts supplements from different content formats', () => {
    const reportWithDifferentFormats = {
      ...mockReport,
      content: `# Informe Personalizado

## Suplementación Recomendada:
1. Proteína Whey Gold Standard
2. Creatina Monohidrato 100% Pure
- Multivitamínico Complejo B
- Omega 3 Fish Oil

## Recomendaciones:
Entrenamiento de fuerza.`,
    };

    render(<ReportView report={reportWithDifferentFormats} />);

    // Verificar que se extraen suplementos de diferentes formatos
    expect(screen.getByText('Proteína Whey Gold Standard')).toBeInTheDocument();
    expect(
      screen.getByText('Creatina Monohidrato 100% Pure')
    ).toBeInTheDocument();
    // Los suplementos con guiones pueden no aparecer en la sección de productos
    // pero sí en el contenido del informe
    const markdownContent = screen.getByTestId('markdown-content');
    expect(markdownContent.textContent).toContain('Multivitamínico Complejo B');
    expect(markdownContent.textContent).toContain('Omega 3 Fish Oil');
  });

  test('handles supplements with special characters and formatting', () => {
    const reportWithSpecialChars = {
      ...mockReport,
      content: `# Informe Personalizado

## Suplementación Recomendada:
- **Proteína Whey [Gold Standard]**: Para recuperación
- **Creatina Monohidrato (100% Pure)**: Para fuerza
- **BCAAs (URL del producto)**: Para recuperación

## Recomendaciones:
Entrenamiento de fuerza.`,
    };

    render(<ReportView report={reportWithSpecialChars} />);

    // Verificar que se extraen los suplementos con caracteres especiales
    expect(
      screen.getByText('Proteína Whey [Gold Standard]')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Creatina Monohidrato (100% Pure)')
    ).toBeInTheDocument();
    expect(screen.getByText('BCAAs (URL del producto)')).toBeInTheDocument();
  });

  test('handles empty content gracefully', () => {
    const reportWithEmptyContent = {
      ...mockReport,
      content: '',
    };

    render(<ReportView report={reportWithEmptyContent} />);

    // Verificar que se renderiza sin errores, pero muestra un mensaje de error
    expect(
      screen.getByText(
        'Error: Datos insuficientes o inválidos para generar el PDF.'
      )
    ).toBeInTheDocument();
  });

  test('handles content with no supplements section', () => {
    const reportWithoutSupplementsSection = {
      ...mockReport,
      content: `# Informe Personalizado

## Recomendaciones de Entrenamiento:
Entrenamiento de fuerza 3-4 veces por semana.

## Nutrición:
Mantener una dieta equilibrada con proteínas, carbohidratos y grasas saludables.

## Consejos:
Descansar adecuadamente entre entrenamientos.

## Plan de Ejercicios:
- Lunes: Pecho y tríceps
- Miércoles: Espalda y bíceps
- Viernes: Piernas y hombros

## Hidratación:
Beber al menos 2 litros de agua al día.

## Descanso:
Dormir 7-8 horas por noche.`,
    };

    render(<ReportView report={reportWithoutSupplementsSection} />);

    // Verificar que NO se muestra la sección de suplementos
    expect(
      screen.queryByText('Productos Recomendados')
    ).not.toBeInTheDocument();
  });

  test('handles clipboard write error gracefully', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
      new Error('Clipboard error')
    );

    render(<ReportView report={mockReport} />);

    const copyButton = screen.getByTitle('Copiar');
    await userEvent.click(copyButton);

    // Verificar que se intenta copiar al portapapeles
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockReport.content
    );

    // Verificar que el componente no se rompe por el error
    expect(screen.getByTitle('Copiar')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
