// Mock jsPDF antes de las importaciones
import React from 'react';
import { render, screen } from '@testing-library/react';
import DownloadButton from './DownloadButton';

const mockSave = jest.fn();
const mockDoc = {
  internal: { pageSize: { getWidth: () => 595 } },
  save: mockSave,
  output: jest.fn(() => new Blob()),
  splitTextToSize: jest.fn((text: string) => [text]),
  text: jest.fn(),
  textWithLink: jest.fn(),
};

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation((): any => {
    return {
      ...mockDoc,
      html: jest.fn((el: any, opts: any) => opts.callback(mockDoc)),
    };
  });
});

describe('DownloadButton', () => {
  it('renders and shows "Descargar" initially', () => {
    render(<DownloadButton content='Test content' />);
    expect(screen.getByText(/Descargar/i)).toBeInTheDocument();
  });

  it('renders with correct content prop', () => {
    const testContent = 'This is test content for PDF';
    render(<DownloadButton content={testContent} />);

    // Verificar que el botón está presente
    expect(screen.getByRole('checkbox', { hidden: true })).toBeInTheDocument();
    expect(screen.getByText(/Descargar/i)).toBeInTheDocument();
  });

  it('renders with htmlRef prop when provided', () => {
    const testContent = 'Test content';
    const mockRef = { current: document.createElement('div') };

    render(<DownloadButton content={testContent} htmlRef={mockRef} />);

    // Verificar que el botón se renderiza correctamente con htmlRef
    expect(screen.getByRole('checkbox', { hidden: true })).toBeInTheDocument();
    expect(screen.getByText(/Descargar/i)).toBeInTheDocument();
  });
});
