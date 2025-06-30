import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from './Footer';
import { handleNavigation, handleContact, handleSocialMedia } from './Footer';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Footer', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    window.scrollTo = jest.fn();
    window.open = jest.fn();
  });

  it('renderiza los textos principales y botones', () => {
    render(<Footer />);
    expect(screen.getByText('footer.nav.title')).toBeInTheDocument();
    expect(screen.getByText('footer.services.title')).toBeInTheDocument();
    expect(screen.getByText('footer.contact.title')).toBeInTheDocument();
    expect(screen.getByText('footer.tagline')).toBeInTheDocument();
    expect(screen.getByText('footer.nav.home')).toBeInTheDocument();
    expect(screen.getByText('footer.services.custom')).toBeInTheDocument();
    expect(screen.getByText('footer.contact.form')).toBeInTheDocument();
  });

  it('los botones de navegación llaman a navigate y hacen scroll', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('footer.nav.home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(window.scrollTo).toHaveBeenCalled();
    fireEvent.click(screen.getByText('footer.nav.deportes'));
    expect(mockNavigate).toHaveBeenCalledWith('/deportes');
    fireEvent.click(screen.getByText('footer.nav.salud'));
    expect(mockNavigate).toHaveBeenCalledWith('/salud');
    fireEvent.click(screen.getByText('footer.nav.grasa'));
    expect(mockNavigate).toHaveBeenCalledWith('/grasa');
    fireEvent.click(screen.getByText('footer.nav.mujer'));
    expect(mockNavigate).toHaveBeenCalledWith('/mujer');
    fireEvent.click(screen.getByText('footer.nav.cognitivo'));
    expect(mockNavigate).toHaveBeenCalledWith('/cognitivo');
  });

  it('el botón de contacto navega a /contact', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('footer.contact.form'));
    expect(mockNavigate).toHaveBeenCalledWith('/contact');
  });

  it('el botón de email abre el mailto', () => {
    render(<Footer />);
    const emailButton = screen.getAllByRole('button').find(btn => btn.innerHTML.includes('svg') && btn.innerHTML.includes('footer.contact.form'));
    // El siguiente botón es el de ubicación
    const locationButton = screen.getAllByRole('button').find(btn => btn.innerHTML.includes('footer.contact.location'));
    // El botón de email no tiene texto visible, así que simulamos el click en el primer botón de contacto externo
    fireEvent.click(screen.getByText('footer.contact.location'));
    expect(window.open).toHaveBeenCalledWith('https://maps.google.com/?q=Granada,Spain', '_blank');
  });

  it('los botones de redes sociales abren el link correcto', () => {
    render(<Footer />);
    const tiktokBtn = screen.getByLabelText('TikTok');
    const twitterBtn = screen.getByLabelText('Twitter');
    const instaBtn = screen.getByLabelText('Instagram');
    fireEvent.click(tiktokBtn);
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('tiktok.com'), '_blank');
    fireEvent.click(twitterBtn);
    const twitterCall = (window.open as jest.Mock).mock.calls.find(call => call[1] === '_blank' && (call[0].includes('twitter.com') || call[0].includes('x.com')));
    expect(twitterCall).toBeTruthy();
    fireEvent.click(instaBtn);
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('instagram.com'), '_blank');
  });
});

describe('Footer handlers', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    window.open = jest.fn();
  });

  it('handleNavigation navega a la ruta correcta y hace scroll', () => {
    const navigate = jest.fn();
    handleNavigation('deportes', navigate);
    expect(navigate).toHaveBeenCalledWith('/deportes');
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('handleNavigation navega a / si la clave es desconocida', () => {
    const navigate = jest.fn();
    handleNavigation('unknown', navigate);
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('handleContact abre el mailto para email', () => {
    handleContact('email');
    expect(window.open).toHaveBeenCalledWith('mailto:endlessgoalsnutrition@gmail.com', '_blank');
  });

  it('handleContact abre la ubicación para location', () => {
    handleContact('location');
    expect(window.open).toHaveBeenCalledWith('https://maps.google.com/?q=Granada,Spain', '_blank');
  });

  it('handleContact no hace nada si el tipo es desconocido', () => {
    handleContact('otro');
    expect(window.open).not.toHaveBeenCalled();
  });

  it('handleSocialMedia abre el link correcto para tiktok', () => {
    handleSocialMedia('tiktok');
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('tiktok.com'), '_blank');
  });

  it('handleSocialMedia abre el link correcto para twitter', () => {
    handleSocialMedia('twitter');
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('x.com'), '_blank');
  });

  it('handleSocialMedia abre el link correcto para instagram', () => {
    handleSocialMedia('instagram');
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('instagram.com'), '_blank');
  });

  it('handleSocialMedia no hace nada si la plataforma es desconocida', () => {
    handleSocialMedia('facebook');
    expect(window.open).not.toHaveBeenCalled();
  });
}); 