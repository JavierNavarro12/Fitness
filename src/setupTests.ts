// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock global de Firebase para todos los tests
jest.mock('./firebase', () => ({
  auth: {},
  db: {},
}));

// Mock global de firebase/auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null); // Simula usuario no autenticado
    return () => {}; // Devuelve función de unsubscribe
  }),
}));

// Mock global de APIs PWA para todos los tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock global de navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock global de service worker APIs
Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    ready: Promise.resolve({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      waiting: null,
      installing: null,
      active: null,
    }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    register: jest.fn(() => Promise.resolve()),
    getRegistration: jest.fn(() => Promise.resolve()),
    getRegistrations: jest.fn(() => Promise.resolve([])),
  },
});

// Mock global de navigator.userAgent para iOS detection
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
});
