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
