import { render, screen, fireEvent } from '@testing-library/react';
import FAQ from './FAQ';

// Mock de useTranslation para cubrir todos los textos
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('FAQ', () => {
  const setNav = jest.fn();

  beforeEach(() => {
    setNav.mockClear();
  });

  it('renderiza título y subtítulo', () => {
    render(<FAQ setNav={setNav} />);
    expect(screen.getByText('faq.title')).toBeInTheDocument();
    expect(screen.getByText('faq.subtitle')).toBeInTheDocument();
  });

  it('renderiza todas las preguntas y respuestas', () => {
    render(<FAQ setNav={setNav} />);
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`faq.q${i}`)).toBeInTheDocument();
      expect(screen.getByText(`faq.a${i}`)).toBeInTheDocument();
    }
  });

  it('renderiza sección de no encontrado y botón de contacto', () => {
    render(<FAQ setNav={setNav} />);
    expect(screen.getByText('faq.notFoundTitle')).toBeInTheDocument();
    expect(screen.getByText('faq.notFoundText')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'faq.contactButton' });
    expect(button).toBeInTheDocument();
  });

  it('llama a setNav("contact") al hacer click en el botón de contacto', () => {
    render(<FAQ setNav={setNav} />);
    const button = screen.getByRole('button', { name: 'faq.contactButton' });
    fireEvent.click(button);
    expect(setNav).toHaveBeenCalledWith('contact');
  });
}); 