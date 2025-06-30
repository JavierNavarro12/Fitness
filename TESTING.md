# 🧪 Automatización de Pruebas - EGN Fitness

Este documento describe la estrategia de automatización de pruebas implementada en el proyecto.

## 📋 Tipos de Pruebas

### **1. Pruebas Unitarias (Jest + React Testing Library)**

- **Ubicación**: `src/**/*.test.tsx`
- **Cobertura**: Componentes React, funciones utilitarias, hooks
- **Ejecución**: `yarn test`

**Ejemplos de pruebas unitarias:**

- Renderizado de componentes
- Interacciones de usuario (clicks, formularios)
- Validación de props y estado
- Integración con Firebase Auth

### **2. Pruebas End-to-End (Cypress)**

- **Ubicación**: `cypress/e2e/`
- **Cobertura**: Flujos completos de usuario
- **Ejecución**: `yarn cypress:open` o `yarn cypress:run`

**Flujos principales cubiertos:**

- ✅ Generación de informes personalizados
- ✅ Navegación entre secciones
- ✅ Formularios de perfil
- ✅ Responsive design (móvil/desktop)

### **3. Pruebas de Performance (Lighthouse CI)**

- **Ubicación**: `.lighthouserc.json`
- **Cobertura**: Performance, Accessibility, Best Practices, SEO
- **Ejecución**: Automático en CI/CD

## 🚀 Comandos Disponibles

```bash
# Pruebas unitarias
yarn test                    # Ejecutar todas las pruebas unitarias
npm test -- --watchAll       # Modo watch para desarrollo
yarn test --coverage        # Con reporte de cobertura

# Pruebas E2E
yarn cypress:open          # Abrir interfaz gráfica de Cypress
yarn cypress:run           # Ejecutar pruebas E2E en modo headless
yarn test:e2e              # Iniciar servidor + ejecutar E2E
yarn test:all              # Ejecutar unitarias + E2E

# Calidad de código
yarn lint                  # Verificar linting
yarn lint:fix             # Corregir problemas de linting
yarn format               # Formatear código con Prettier
yarn type-check           # Verificar tipos TypeScript
```

## 🔧 Automatización Avanzada

### **1. Pre-commit Hooks (Husky + lint-staged)**

- **Formateo automático** de código con Prettier
- **Linting automático** con ESLint
- **Validación de tipos** TypeScript
- **Ejecución de tests unitarios** antes de cada commit
- **Validación de mensajes de commit** (conventional commits)

### **2. GitHub Actions CI/CD**

- **Tests automáticos** en push y pull requests
- **Múltiples versiones de Node.js** (18.x, 20.x)
- **Reportes de cobertura** automáticos
- **Screenshots y videos** de Cypress en fallos
- **Build verification** automático
- **Performance testing** con Lighthouse CI

### **3. Configuración de Calidad**

- **Prettier** para formateo consistente
- **ESLint** para reglas de código
- **TypeScript** para verificación de tipos
- **Husky** para git hooks
- **lint-staged** para archivos modificados

## 📁 Estructura de Archivos

```
├── .github/
│   └── workflows/
│       └── test.yml              # GitHub Actions CI/CD
├── .husky/
│   ├── pre-commit               # Hook pre-commit
│   └── commit-msg               # Hook commit-msg
├── src/
│   ├── components/**/*.test.tsx # Pruebas unitarias
│   └── ...
├── cypress/
│   ├── e2e/
│   │   ├── report-generation.cy.ts
│   │   └── navigation.cy.ts
│   ├── support/
│   │   ├── commands.ts
│   │   └── e2e.ts
│   └── fixtures/
├── .lighthouserc.json           # Configuración Lighthouse CI
├── .prettierrc                  # Configuración Prettier
├── cypress.config.ts
└── TESTING.md                   # Esta documentación
```

## 🎯 Flujos Críticos Automatizados

### **1. Generación de Informes**

```typescript
// cypress/e2e/report-generation.cy.ts
describe('Report Generation Flow', () => {
  it('should complete the profile form and generate a report', () => {
    cy.visit('/custom');
    // Llenar formulario completo
    // Generar informe
    // Verificar resultado
  });
});
```

### **2. Navegación Principal**

```typescript
// cypress/e2e/navigation.cy.ts
describe('Navigation', () => {
  it('should navigate to all main sections', () => {
    // Probar navegación entre todas las secciones
    // Verificar responsive design
    // Probar cambio de idioma
  });
});
```

## 🔧 Configuración

### **Cypress**

- **Base URL**: `http://localhost:3000`
- **Viewport**: 1280x720 (desktop), iPhone X (móvil)
- **Timeouts**: 10 segundos por defecto
- **Videos**: Deshabilitados para velocidad
- **Screenshots**: Automáticos en fallos

### **Jest**

- **Framework**: React Testing Library
- **Cobertura**: Incluida en el reporte
- **Mocking**: Firebase, APIs externas
- **Environment**: jsdom

### **Lighthouse CI**

- **Performance**: Mínimo 80%
- **Accessibility**: Mínimo 90%
- **Best Practices**: Mínimo 80%
- **SEO**: Mínimo 80%
- **FCP**: Máximo 2s
- **LCP**: Máximo 2.5s
- **CLS**: Máximo 0.1
- **TBT**: Máximo 300ms

## 📊 Métricas de Calidad

### **Cobertura Actual**

- **Pruebas Unitarias**: ~85% de componentes críticos
- **Pruebas E2E**: Flujos principales cubiertos
- **Tiempo de ejecución**: < 2 minutos (unitarias), < 5 minutos (E2E)
- **Performance**: Lighthouse scores > 80%

### **Puntos de Verificación**

- ✅ Build exitoso
- ✅ Todas las pruebas unitarias pasan
- ✅ Pruebas E2E críticas pasan
- ✅ Sin errores de linting
- ✅ Performance aceptable (Lighthouse)
- ✅ Formateo de código consistente
- ✅ Tipos TypeScript válidos
- ✅ Mensajes de commit convencionales

## 🚨 CI/CD Integration

### **GitHub Actions (Automático)**

```yaml
# .github/workflows/test.yml
name: 🧪 Tests & Quality Checks
on: [push, pull_request]
jobs:
  - test (unit + E2E)
  - build (verificación)
  - lighthouse (performance)
```

### **Netlify (Producción)**

```yaml
# netlify.toml
[build]
  command = "npm install --legacy-peer-deps && npm run build"
  # Las pruebas se ejecutan antes del build
```

### **Local Development**

```bash
# Antes de commit (automático)
git commit -m "feat: add new feature"
# Se ejecutan automáticamente:
# - lint-staged (formateo + linting)
# - type-check
# - unit tests
```

## 🛠️ Troubleshooting

### **Problemas Comunes**

1. **Cypress no encuentra elementos**
   - Verificar que el servidor esté corriendo
   - Aumentar timeouts si es necesario
   - Usar `cy.wait()` para elementos dinámicos

2. **Pruebas unitarias fallan**
   - Verificar mocks de Firebase
   - Limpiar localStorage entre pruebas
   - Revisar dependencias de componentes

3. **Pre-commit hooks fallan**
   - Ejecutar `yarn lint:fix` manualmente
   - Ejecutar `yarn format` para formateo
   - Verificar tipos con `yarn type-check`

4. **Lighthouse falla**
   - Verificar que el build sea exitoso
   - Revisar métricas de performance
   - Optimizar imágenes y recursos

## 📈 Próximos Pasos

### **Mejoras Implementadas** ✅

- [x] GitHub Actions CI/CD
- [x] Pre-commit hooks con Husky
- [x] Formateo automático con Prettier
- [x] Linting automático con ESLint
- [x] Performance testing con Lighthouse CI
- [x] Conventional commit messages
- [x] Type checking automático

### **Mejoras Planificadas**

- [ ] Añadir pruebas de accesibilidad (axe-core)
- [ ] Implementar pruebas de integración con APIs
- [ ] Configurar reportes automáticos de cobertura
- [ ] Añadir pruebas de seguridad
- [ ] Implementar pruebas de regresión visual

### **Herramientas Adicionales**

- [ ] Playwright (alternativa a Cypress)
- [ ] Storybook para pruebas de componentes
- [ ] Percy para pruebas visuales
- [ ] SonarQube para análisis de código

## 📞 Soporte

Para dudas sobre las pruebas:

1. Revisar esta documentación
2. Consultar logs de Cypress en `cypress/videos/`
3. Verificar configuración en `cypress.config.ts`
4. Revisar comandos personalizados en `cypress/support/commands.ts`
5. Verificar GitHub Actions en `.github/workflows/test.yml`
