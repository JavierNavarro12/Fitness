import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Switch from './Switch';

describe('Switch', () => {
  it('renders with light mode selected', () => {
    render(<Switch checked={false} onChange={jest.fn()} />);
    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
  });

  it('renders with dark mode selected', () => {
    render(<Switch checked={true} onChange={jest.fn()} />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
  });

  it('calls onChange when toggled', () => {
    const onChange = jest.fn();
    render(<Switch checked={false} onChange={onChange} />);
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalled();
  });
});
