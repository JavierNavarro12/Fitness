import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPanel from './SearchPanel';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('SearchPanel', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnResultClick = jest.fn();
  const results = [
    {
      id: '1',
      category: 'suplementos',
      title: 'Creatina',
      snippet: 'Mejora el rendimiento',
    },
    {
      id: '2',
      category: 'vitaminas',
      title: 'Vitamina D',
      snippet: 'Salud ósea',
    },
  ];

  it('renders the search input', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SearchPanel
          searchQuery=''
          onSearchChange={mockOnSearchChange}
          results={[]}
          onResultClick={mockOnResultClick}
        />
      </I18nextProvider>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SearchPanel
          searchQuery=''
          onSearchChange={mockOnSearchChange}
          results={[]}
          onResultClick={mockOnResultClick}
        />
      </I18nextProvider>
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'creatina' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('creatina');
  });

  it('shows results when focused and query is present', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SearchPanel
          searchQuery='creatina'
          onSearchChange={mockOnSearchChange}
          results={results}
          onResultClick={mockOnResultClick}
        />
      </I18nextProvider>
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(screen.getByText(/Creatina/i)).toBeInTheDocument();
    expect(screen.getByText(/Vitamina D/i)).toBeInTheDocument();
  });

  it('calls onResultClick and hides results when clicking a result', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SearchPanel
          searchQuery='creatina'
          onSearchChange={mockOnSearchChange}
          results={results}
          onResultClick={mockOnResultClick}
        />
      </I18nextProvider>
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    const resultButton = screen.getByRole('button', { name: /Creatina/i });
    fireEvent.click(resultButton);
    expect(mockOnResultClick).toHaveBeenCalledWith(results[0]);
    // El panel de resultados debe ocultarse (no debe estar en el documento)
    expect(screen.queryByText(/Vitamina D/i)).not.toBeInTheDocument();
  });

  it('hides results when clicking outside the form', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SearchPanel
          searchQuery='creatina'
          onSearchChange={mockOnSearchChange}
          results={results}
          onResultClick={mockOnResultClick}
        />
      </I18nextProvider>
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(screen.getByText(/Creatina/i)).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText(/Creatina/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Vitamina D/i)).not.toBeInTheDocument();
    });
  });

  it('prevents default on form submit', () => {
    const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault');
    
    render(
      <I18nextProvider i18n={i18n}>
        <SearchPanel
          searchQuery='creatina'
          onSearchChange={mockOnSearchChange}
          results={results}
          onResultClick={mockOnResultClick}
        />
      </I18nextProvider>
    );
    const form = document.querySelector('form');
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
      expect(preventDefaultSpy).toHaveBeenCalled();
    }
    
    preventDefaultSpy.mockRestore();
  });
});
 