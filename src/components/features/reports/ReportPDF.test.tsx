import React from 'react';
import { render } from '@testing-library/react';
import ReportPDF from './ReportPDF';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'report.linksTitle': 'Enlaces de Productos',
        'report.title': 'Informe Personalizado',
        'report.copy': 'Copiar',
        'report.copied': 'Copiado',
        'report.download': 'Descargar PDF',
        'report.delete': 'Eliminar',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock de @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  Document: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="pdf-page" style={style}>{children}</div>
  ),
  Text: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="pdf-text" style={style}>{children}</div>
  ),
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="pdf-view" style={style}>{children}</div>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Link: ({ children, src, style }: { children: React.ReactNode; src?: string; style?: any }) => (
    <a data-testid="pdf-link" href={src} style={style}>{children}</a>
  ),
}));

describe('ReportPDF Component', () => {
  const mockSupplements = [
    { name: 'Proteína Whey', link: 'https://www.amazon.es/s?k=Proteína+Whey' },
    { name: 'Creatina Monohidrato', link: 'https://www.amazon.es/s?k=Creatina+Monohidrato' },
  ];

  test('renders PDF document with basic content', () => {
    const { getByTestId, container } = render(
      <ReportPDF
        title="Informe de Entrenamiento"
        content="Este es un informe personalizado de entrenamiento."
        supplements={[]}
      />
    );

    // Verificar que se renderiza el documento PDF
    expect(getByTestId('pdf-document')).toBeInTheDocument();
    expect(getByTestId('pdf-page')).toBeInTheDocument();

    // Verificar que el contenido se renderiza
    expect(container.textContent).toContain('Informe de Entrenamiento');
    expect(container.textContent).toContain('Este es un informe personalizado de entrenamiento.');
  });

  test('renders PDF with supplements section when supplements are provided', () => {
    const { getByTestId, getByText, container } = render(
      <ReportPDF
        title="Informe de Entrenamiento"
        content="Este es un informe personalizado de entrenamiento."
        supplements={mockSupplements}
      />
    );

    // Verificar que se renderiza la sección de suplementos
    expect(getByText('Enlaces de Productos')).toBeInTheDocument();
    
    // Verificar que los suplementos se renderizan
    expect(container.textContent).toContain('1. Proteína Whey');
    expect(container.textContent).toContain('2. Creatina Monohidrato');

    // Verificar que los enlaces se renderizan correctamente
    const links = container.querySelectorAll('[data-testid="pdf-link"]');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://www.amazon.es/s?k=Proteína+Whey');
    expect(links[1]).toHaveAttribute('href', 'https://www.amazon.es/s?k=Creatina+Monohidrato');
  });

  test('renders PDF without supplements section when supplements array is empty', () => {
    const { queryByText } = render(
      <ReportPDF
        title="Informe de Entrenamiento"
        content="Este es un informe personalizado de entrenamiento."
        supplements={[]}
      />
    );

    // Verificar que NO se renderiza la sección de suplementos
    expect(queryByText('Enlaces de Productos')).not.toBeInTheDocument();
  });

  test('renders PDF with date when date is provided', () => {
    const testDate = '15/12/2024';
    const { container } = render(
      <ReportPDF
        title="Informe de Entrenamiento"
        content="Este es un informe personalizado de entrenamiento."
        supplements={[]}
        date={testDate}
      />
    );

    // Verificar que la fecha se renderiza
    expect(container.textContent).toContain(testDate);
  });

  test('renders PDF without date when date is not provided', () => {
    const { container } = render(
      <ReportPDF
        title="Informe de Entrenamiento"
        content="Este es un informe personalizado de entrenamiento."
        supplements={[]}
      />
    );

    // Verificar que no hay fecha en el contenido
    expect(container.textContent).not.toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
  });

  test('renders PDF with long content', () => {
    const longContent = `
      Este es un informe muy largo con múltiples párrafos.
      
      Incluye recomendaciones detalladas de entrenamiento y nutrición.
      
      También contiene información sobre suplementación y descanso.
      
      El objetivo es proporcionar una guía completa para el usuario.
    `;

    const { container } = render(
      <ReportPDF
        title="Informe Completo"
        content={longContent}
        supplements={mockSupplements}
      />
    );

    // Verificar que el contenido largo se renderiza
    expect(container.textContent).toContain('Este es un informe muy largo');
    expect(container.textContent).toContain('Incluye recomendaciones detalladas');
    expect(container.textContent).toContain('También contiene información');
  });

  test('renders PDF with special characters in content', () => {
    const contentWithSpecialChars = 'Informe con caracteres especiales: áéíóú ñ ü ¿¡ €$%&';
    
    const { container } = render(
      <ReportPDF
        title="Informe Especial"
        content={contentWithSpecialChars}
        supplements={[]}
      />
    );

    // Verificar que los caracteres especiales se renderizan correctamente
    expect(container.textContent).toContain('Informe con caracteres especiales: áéíóú ñ ü ¿¡ €$%&');
  });

  test('renders PDF with multiple supplements and correct numbering', () => {
    const multipleSupplements = [
      { name: 'Proteína Whey', link: 'https://www.amazon.es/s?k=Proteína+Whey' },
      { name: 'Creatina Monohidrato', link: 'https://www.amazon.es/s?k=Creatina+Monohidrato' },
      { name: 'BCAAs', link: 'https://www.amazon.es/s?k=BCAAs' },
      { name: 'Multivitamínico', link: 'https://www.amazon.es/s?k=Multivitamínico' },
    ];

    const { container } = render(
      <ReportPDF
        title="Informe con Múltiples Suplementos"
        content="Informe de entrenamiento."
        supplements={multipleSupplements}
      />
    );

    // Verificar que todos los suplementos se renderizan con numeración correcta
    expect(container.textContent).toContain('1. Proteína Whey');
    expect(container.textContent).toContain('2. Creatina Monohidrato');
    expect(container.textContent).toContain('3. BCAAs');
    expect(container.textContent).toContain('4. Multivitamínico');

    // Verificar que se renderizan todos los enlaces
    const links = container.querySelectorAll('[data-testid="pdf-link"]');
    expect(links).toHaveLength(4);
  });

  test('renders PDF with empty title', () => {
    const { container } = render(
      <ReportPDF
        title=""
        content="Este es un informe sin título."
        supplements={[]}
      />
    );

    // Verificar que el contenido se renderiza sin título
    expect(container.textContent).toContain('Este es un informe sin título.');
  });

  test('renders PDF with empty content', () => {
    const { getByTestId } = render(
      <ReportPDF
        title="Informe Vacío"
        content=""
        supplements={[]}
      />
    );

    // Verificar que el documento se renderiza incluso con contenido vacío
    expect(getByTestId('pdf-document')).toBeInTheDocument();
    expect(getByTestId('pdf-page')).toBeInTheDocument();
  });

  test('renders PDF with supplements that have special characters in names', () => {
    const supplementsWithSpecialChars = [
      { name: 'Proteína Whey Gold Standard', link: 'https://www.amazon.es/s?k=Proteína+Whey+Gold+Standard' },
      { name: 'Creatina Monohidrato 100% Pure', link: 'https://www.amazon.es/s?k=Creatina+Monohidrato+100%25+Pure' },
    ];

    const { container } = render(
      <ReportPDF
        title="Informe con Suplementos Especiales"
        content="Informe de entrenamiento."
        supplements={supplementsWithSpecialChars}
      />
    );

    // Verificar que los suplementos con caracteres especiales se renderizan
    expect(container.textContent).toContain('1. Proteína Whey Gold Standard');
    expect(container.textContent).toContain('2. Creatina Monohidrato 100% Pure');

    // Verificar que los enlaces se renderizan correctamente
    const links = container.querySelectorAll('[data-testid="pdf-link"]');
    expect(links).toHaveLength(2);
  });
}); 