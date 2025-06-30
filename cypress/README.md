# Cypress E2E Tests

Este directorio contiene las pruebas end-to-end (E2E) de la aplicación usando [Cypress](https://www.cypress.io/).

## Estructura

- `e2e/` — Pruebas E2E organizadas por flujo o funcionalidad.
- `support/` — Comandos personalizados y configuración global de Cypress.
- `downloads/`, `screenshots/` — Carpeta generada automáticamente por Cypress para descargas y capturas de pantalla.

## Comandos útiles

- **Abrir Cypress en modo interactivo (GUI):**
  ```bash
  npx cypress open --browser chrome
  ```
- **Ejecutar todos los tests en modo headless:**
  ```bash
  npx cypress run --browser chrome
  ```

## Buenas prácticas

- Usa `cy.viewport()` para asegurar el layout correcto (desktop/mobile) en cada test.
- Utiliza selectores robustos (`data-testid`, `aria-label`) para mayor estabilidad.
- Mantén los tests independientes y limpios; usa `beforeEach` para preparar el estado inicial.
- Documenta cualquier flujo especial o credenciales de prueba necesarias.

## Recursos

- [Documentación oficial de Cypress](https://docs.cypress.io/)

---

¿Tienes dudas o sugerencias? ¡Agrega una nota aquí para el equipo!
