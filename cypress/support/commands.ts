/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Asegura que el archivo es un módulo para TypeScript
export {};

// Extiende la interfaz Chainable de Cypress para los comandos personalizados
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to fill the profile form
       * @example cy.fillProfileForm()
       */
      fillProfileForm(): Chainable;

      /**
       * Custom command to generate a report
       * @example cy.generateReport()
       */
      generateReport(): Chainable;

      /**
       * Custom command to login with test user
       * @example cy.login()
       */
      login(): Chainable;

      /**
       * Custom command to wait for loading to complete
       * @example cy.waitForLoading()
       */
      waitForLoading(): Chainable;
    }
  }
}

// Comando para llenar el formulario de perfil
Cypress.Commands.add('fillProfileForm', () => {
  // Información personal
  cy.get('[data-testid="age-input"]').type('25');
  cy.get('[data-testid="gender-select"]').select('male');
  cy.get('[data-testid="weight-input"]').type('75');
  cy.get('[data-testid="height-input"]').type('180');

  // Objetivos y experiencia
  cy.get('[data-testid="objective-select"]').select('muscle_gain');
  cy.get('[data-testid="experience-select"]').select('intermediate');
  cy.get('[data-testid="frequency-select"]').select('4-5_times');
  cy.get('[data-testid="sport-select"]').select('weightlifting');

  // Condiciones médicas (ninguna)
  cy.get('[data-testid="medical-conditions"]').should('exist');
});

// Comando para generar un informe
Cypress.Commands.add('generateReport', () => {
  cy.get('[data-testid="generate-report-btn"]').click();
  cy.waitForLoading();
  cy.get('[data-testid="report-content"]').should('be.visible');
});

// Comando para login (mock)
Cypress.Commands.add('login', () => {
  const email = Cypress.env('testUserEmail');
  const password = Cypress.env('testUserPassword');

  if (!email || !password) {
    throw new Error(
      '❌ Variables de entorno testUserEmail y testUserPassword no configuradas en Cypress'
    );
  }

  cy.visit('/login');
  cy.get('[data-testid="login-email"]').should('be.visible').type(email);
  cy.get('[data-testid="login-password"]').should('be.visible').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Comando para esperar que termine la carga
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loader"]', { timeout: 30000 }).should('not.exist');
  cy.get('[data-testid="loading"]', { timeout: 30000 }).should('not.exist');
});
