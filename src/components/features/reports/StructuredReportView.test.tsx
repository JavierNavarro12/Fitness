import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StructuredReportView from './StructuredReportView';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockStructuredReport = {
  id: '1',
  content: `# Introducción Personalizada
¡Hola! Te ayudo con tu plan personalizado.

## Proteína Whey
Dosis recomendada: 30g
Momento de toma: Después del ejercicio
Observaciones: Ayuda en la recuperación muscular

## Creatina Monohidratada
Dosis recomendada: 5g
Momento de toma: En cualquier momento del día
Observaciones: Puede aumentar la retención de agua

## Omega-3
Dosis recomendada: 2g
Momento de toma: Con una comida
Observaciones: Puede diluir la sangre

## Notas Adicionales
Este informe se basa en tus datos y la información disponible. Consulta a un profesional de la salud antes de comenzar cualquier suplementación.`,
  createdAt: '2023-01-01T00:00:00Z',
  userId: 'test-uid',
};

const mockUnstructuredReport = {
  id: '2',
  content: `# Informe Regular
Este es un informe que no sigue el formato estructurado.
Contiene información general sobre suplementos.`,
  createdAt: '2023-01-01T00:00:00Z',
  userId: 'test-uid',
};

describe('StructuredReportView', () => {
  it('renderiza correctamente con contenido estructurado', () => {
    render(<StructuredReportView report={mockStructuredReport} />);

    expect(
      screen.getByText('Recomendaciones Personalizadas')
    ).toBeInTheDocument();
    expect(screen.getByText('Proteína Whey')).toBeInTheDocument();
    expect(screen.getByText('Creatina Monohidratada')).toBeInTheDocument();
    expect(screen.getByText('Omega-3')).toBeInTheDocument();
  });

  it('muestra información de dosis correctamente', () => {
    render(<StructuredReportView report={mockStructuredReport} />);

    expect(screen.getByText('30g')).toBeInTheDocument();
    expect(screen.getByText('5g')).toBeInTheDocument();
    expect(screen.getByText('2g')).toBeInTheDocument();
  });

  it('muestra información de momento de toma', () => {
    render(<StructuredReportView report={mockStructuredReport} />);

    expect(screen.getByText('Después del ejercicio')).toBeInTheDocument();
    expect(
      screen.getByText('En cualquier momento del día')
    ).toBeInTheDocument();
    expect(screen.getByText('Con una comida')).toBeInTheDocument();
  });

  it('muestra observaciones e interacciones', () => {
    render(<StructuredReportView report={mockStructuredReport} />);

    expect(
      screen.getByText('Ayuda en la recuperación muscular')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Puede aumentar la retención de agua')
    ).toBeInTheDocument();
    expect(screen.getByText('Puede diluir la sangre')).toBeInTheDocument();
  });

  it('muestra notas adicionales cuando están presentes', () => {
    render(<StructuredReportView report={mockStructuredReport} />);

    // Use getAllByText since there might be multiple headings with similar text, then check for the specific section
    const notasHeaders = screen.getAllByText(/Notas Adicionales/i);
    expect(notasHeaders.length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Este informe se basa en tus datos/)
    ).toBeInTheDocument();
  });

  it('maneja reportes sin estructura correctamente', () => {
    render(<StructuredReportView report={mockUnstructuredReport} />);

    expect(
      screen.getByText('Recomendaciones Personalizadas')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'No se encontraron suplementos estructurados en este informe.'
      )
    ).toBeInTheDocument();
  });

  it('asigna categorías correctamente según el tipo de suplemento', () => {
    render(<StructuredReportView report={mockStructuredReport} />);

    // Proteína debería ser "Post-entrenamiento"
    expect(screen.getByText('Post-entrenamiento')).toBeInTheDocument();

    // Creatina y Omega-3 deberían ser "Diario" (solo 2, no 3)
    expect(screen.getAllByText('Diario')).toHaveLength(2);
  });
});
