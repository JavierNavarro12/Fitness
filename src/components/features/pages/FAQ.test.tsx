import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import FAQ from './FAQ';

// Mock de useTranslation para cubrir todos los textos
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('FAQ', () => {
  const setNav = jest.fn();

  const renderFAQ = () => {
    return render(
      <MemoryRouter>
        <HelmetProvider>
          <FAQ setNav={setNav} />
        </HelmetProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    setNav.mockClear();
  });

  it('renderiza título y subtítulo', () => {
    renderFAQ();
    expect(screen.getByText('faq.title')).toBeInTheDocument();
    expect(screen.getByText('faq.subtitle')).toBeInTheDocument();
  });

  it('renderiza todas las preguntas y respuestas', () => {
    renderFAQ();
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`faq.q${i}`)).toBeInTheDocument();
      expect(screen.getByText(`faq.a${i}`)).toBeInTheDocument();
    }
  });

  it('renderiza sección de no encontrado y botón de contacto', () => {
    renderFAQ();
    expect(screen.getByText('faq.notFoundTitle')).toBeInTheDocument();
    expect(screen.getByText('faq.notFoundText')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'faq.contactButton' });
    expect(button).toBeInTheDocument();
  });

  it('llama a setNav("contact") al hacer click en el botón de contacto', () => {
    renderFAQ();
    const button = screen.getByRole('button', { name: 'faq.contactButton' });
    fireEvent.click(button);
    expect(setNav).toHaveBeenCalledWith('contact');
  });
});
