import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Footer from './components/layout/Footer';

jest.mock('react-markdown', () => () => <div>Markdown</div>);
jest.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: () => <div>PDFDownloadLink</div>,
  StyleSheet: { create: () => ({}) },
}));
// Mock de Firebase Auth y Firestore
jest.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  onAuthStateChanged: (_auth: any, callback: any) => {
    callback(null);
    return () => {}; // función de desuscripción
  },
  signOut: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  addDoc: jest.fn(),
}));
// Mock de firebase.ts para evitar inicialización real
jest.mock('./firebase', () => ({
  ...jest.requireActual('./firebase'),
  auth: {},
  db: {},
}));
// Mock de SplashScreen para que no bloquee el render
jest.mock('./components/layout/SplashScreen', () => () => null);

window.scrollTo = jest.fn();

beforeAll(() => {
  window.innerWidth = 1024; // >= 640px para 'sm'
  window.dispatchEvent(new Event('resize'));
});

describe('Footer', () => {
  test('renders the EGN text', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </I18nextProvider>
    );
    const matches = screen.getAllByText(/EGN/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
