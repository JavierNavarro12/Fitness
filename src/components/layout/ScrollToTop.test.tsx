import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('llama a window.scrollTo(0, 0) al montar', () => {
    render(
      <MemoryRouter initialEntries={['/inicio']}>
        <ScrollToTop />
        <Routes>
          <Route path='/:page' element={<div />} />
        </Routes>
      </MemoryRouter>
    );
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
}); 