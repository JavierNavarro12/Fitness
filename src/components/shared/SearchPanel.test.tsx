import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
});
