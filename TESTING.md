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

## 🚀 Comandos Disponibles

```bash
# Pruebas unitarias
yarn test                    # Ejecutar todas las pruebas unitarias
yarn test --watch           # Modo watch para desarrollo
yarn test --coverage        # Con reporte de cobertura

# Pruebas E2E
yarn cypress:open          # Abrir interfaz gráfica de Cypress
yarn cypress:run           # Ejecutar pruebas E2E en modo headless
yarn test:e2e              # Iniciar servidor + ejecutar E2E
yarn test:all              # Ejecutar unitarias + E2E
```

## 📁 Estructura de Archivos

```
├── src/
│   ├── components/**/*.test.tsx    # Pruebas unitarias
│   └── ...
├── cypress/
│   ├── e2e/
│   │   ├── report-generation.cy.ts # Flujo de generación de informes
│   │   └── navigation.cy.ts        # Pruebas de navegación
│   ├── support/
│   │   ├── commands.ts             # Comandos personalizados
│   │   └── e2e.ts                  # Configuración global
│   └── fixtures/                   # Datos de prueba
├── cypress.config.ts               # Configuración de Cypress
└── TESTING.md                      # Esta documentación
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

## 📊 Métricas de Calidad

### **Cobertura Actual**
- **Pruebas Unitarias**: ~85% de componentes críticos
- **Pruebas E2E**: Flujos principales cubiertos
- **Tiempo de ejecución**: < 2 minutos (unitarias), < 5 minutos (E2E)

### **Puntos de Verificación**
- ✅ Build exitoso
- ✅ Todas las pruebas unitarias pasan
- ✅ Pruebas E2E críticas pasan
- ✅ Sin errores de linting
- ✅ Performance aceptable (Lighthouse)

## 🚨 CI/CD Integration

### **Netlify (Producción)**
```yaml
# netlify.toml
[build]
  command = "npm install --legacy-peer-deps && npm run build"
  # Las pruebas se ejecutan antes del build
```

### **Local Development**
```bash
# Antes de commit
yarn test:all
yarn build
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

3. **Problemas de rendimiento**
   - Usar `cy.viewport()` para responsive
   - Optimizar selectores CSS
   - Reducir número de screenshots

## 📈 Próximos Pasos

### **Mejoras Planificadas**
- [ ] Añadir pruebas de accesibilidad (axe-core)
- [ ] Implementar pruebas de performance
- [ ] Añadir pruebas de integración con APIs
- [ ] Configurar reportes automáticos de cobertura

### **Herramientas Adicionales**
- [ ] Playwright (alternativa a Cypress)
- [ ] Storybook para pruebas de componentes
- [ ] Percy para pruebas visuales
- [ ] Lighthouse CI para performance

## 📞 Soporte

Para dudas sobre las pruebas:
1. Revisar esta documentación
2. Consultar logs de Cypress en `cypress/videos/`
3. Verificar configuración en `cypress.config.ts`
4. Revisar comandos personalizados en `cypress/support/commands.ts` 