/// <reference types="cypress" />

describe('Login - flujo de error', () => {
  it('muestra un mensaje de error si la contraseña es incorrecta', () => {
    cy.visit('/login');
    cy.get('[data-testid="login-email"]').type('usuario@ejemplo.com');
    cy.get('[data-testid="login-password"]').type('contraseñaIncorrecta');
    cy.get('button[type="submit"]').click();

    // Espera a que aparezca el mensaje de error
    cy.contains(/contraseña incorrecta|credenciales inválidas|error/i, {
      timeout: 5000,
    }).should('be.visible');
    // Asegúrate de que sigue en la página de login
    cy.url().should('include', '/login');
  });
});
