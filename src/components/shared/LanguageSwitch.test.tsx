import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitch from './LanguageSwitch';

describe('LanguageSwitch', () => {
  it('renders with ES selected', () => {
    render(<LanguageSwitch checked={false} onChange={jest.fn()} />);
    expect(screen.getByText('ES')).toHaveClass('text-blue-500');
    expect(screen.getByText('EN')).toHaveClass('text-gray-500');
    expect(screen.getByTestId('language-switch')).not.toBeChecked();
  });

  it('renders with EN selected', () => {
    render(<LanguageSwitch checked={true} onChange={jest.fn()} />);
    expect(screen.getByText('EN')).toHaveClass('text-blue-500');
    expect(screen.getByText('ES')).toHaveClass('text-gray-500');
    expect(screen.getByTestId('language-switch')).toBeChecked();
  });

  it('calls onChange when toggled', () => {
    const onChange = jest.fn();
    render(<LanguageSwitch checked={false} onChange={onChange} />);
    const input = screen.getByTestId('language-switch');
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalled();
  });
});
