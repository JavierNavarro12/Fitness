# EGN Fitness

**Asesor de Suplementación Deportiva Personalizada con IA**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange.svg)](https://firebase.google.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-green.svg)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Descripción

EGN Fitness es una plataforma web progresiva que utiliza inteligencia artificial para generar recomendaciones personalizadas de suplementación deportiva. La aplicación combina educación, personalización y tecnología avanzada para ayudar a los usuarios a tomar decisiones informadas y seguras sobre suplementos.

## 🌐 Demo

**[Accede a la demo en vivo](https://endlessgoalsnutrition.com/)**

## ✨ Características Principales

- 🧠 **IA Personalizada**: Recomendaciones basadas en perfil completo del usuario
- 📊 **Reportes Profesionales**: Generación automática de informes detallados
- 💬 **Chat Inteligente**: Asistente virtual con contexto personalizado
- 📱 **PWA**: Aplicación web progresiva con funcionalidad offline
- 🌍 **Internacionalización**: Soporte completo para Español e Inglés
- 📄 **Exportación PDF**: Reportes descargables en formato profesional
- 🔐 **Autenticación**: Sistema seguro con Firebase Auth
- 📈 **Historial**: Seguimiento de reportes y conversaciones

## 🛠️ Stack Tecnológico

### Frontend

- **React 18** con TypeScript
- **Tailwind CSS** para estilos responsivos
- **Styled Components** para estilos dinámicos
- **React Router** para navegación SPA
- **React i18next** para internacionalización
- **AOS** para animaciones suaves
- **React PDF** y **jsPDF** para generación de documentos
- **React Markdown** para contenido dinámico
- **React Select** para formularios avanzados
- **React Icons** y **FontAwesome** para iconografía
- **React Helmet Async** para SEO y metadatos

### Backend & Servicios

- **Firebase Auth** para autenticación
- **Firestore** para base de datos NoSQL (incluye sistema de comentarios, likes y favoritos)
- **OpenAI GPT-3.5** para inteligencia artificial
- **Contentful** como CMS headless para gestión de blogs
- **Netlify Functions** para API serverless (incluye integración con OpenAI)
- **Netlify Forms** para formularios de contacto
- **Netlify** para hosting y CDN
- **Sistema de notificaciones** y generación de sitemap

### Testing & Calidad

- **Jest** para testing unitario con coverage
- **React Testing Library** para testing de componentes
- **Cypress 14** para tests end-to-end (E2E)
- **ESLint** para análisis estático de código
- **Prettier** para formateo automático
- **Husky** y **lint-staged** para hooks de pre-commit

### CI/CD & DevOps

- **GitHub Actions** para integración continua
- **Codecov** para reportes de cobertura
- **Lighthouse CI** para auditoría de rendimiento
- **TypeScript** para tipado estático
- **CRACO** para configuración avanzada de Webpack
- **Serve** y **Start Server and Test** para despliegue y testing automatizado

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JavierNavarro12/egn-fitness.git
cd egn-fitness

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Firebase y OpenAI

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build
```

## 📋 Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id
REACT_APP_FIREBASE_VAPID_KEY=tu_vapid_key

# OpenAI Configuration
OPENAI_API_KEY=tu_openai_key

# Contentful Configuration
REACT_APP_CONTENTFUL_SPACE_ID=tu_contentful_space_id
REACT_APP_CONTENTFUL_ACCESS_TOKEN=tu_contentful_access_token
REACT_APP_CONTENTFUL_ENVIRONMENT=master

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=tu_google_client_id

# Cypress Test Credentials (solo para desarrollo)
CYPRESS_testUserEmail=test@example.com
CYPRESS_testUserPassword=test_password
```

**⚠️ IMPORTANTE - Seguridad:**

- **NUNCA** subas credenciales al repositorio
- Usa variables de entorno para todas las claves
- Las credenciales de test solo deben usarse en desarrollo
- Revisa regularmente `npm audit` para vulnerabilidades

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecutar en modo desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar tests unitarios
npm run test:e2e   # Ejecutar tests E2E con Cypress
npm run test:all   # Ejecutar todos los tests
npm run cypress:open # Abrir Cypress en modo interactivo
npm run lint       # Análisis de código con ESLint
npm run format     # Formatear código con Prettier
```

## 🧪 Testing & Cobertura

El proyecto incluye una suite completa de testing:

### Tests Unitarios

- **Framework**: Jest + React Testing Library
- **Cobertura**: Reportes automáticos con Codecov
- **Comando**: `npm test`

### Tests E2E

- **Framework**: Cypress
- **Configuración**: Automated viewport testing
- **Comando**: `npm run cypress:run`

### CI/CD Pipeline

- ✅ Tests unitarios automáticos
- ✅ Tests E2E en cada PR
- ✅ Reportes de cobertura
- ✅ Auditoría de rendimiento con Lighthouse
- ✅ Deploy automático a Netlify

## ✅ Estado del Proyecto

### ✅ Implementado

- [x] Sistema de autenticación completo
- [x] Formulario de personalización multi-paso
- [x] Generación de reportes con IA
- [x] Chat inteligente personalizado
- [x] Historial de reportes y conversaciones
- [x] Exportación a PDF
- [x] Interfaz responsive y PWA
- [x] Internacionalización (ES/EN)
- [x] Sistema de búsqueda semántica
- [x] Modo oscuro/claro
- [x] Pipeline CI/CD completo
- [x] Tests unitarios y E2E

### 🚧 En Desarrollo

- [ ] Integración con wearables
- [ ] Sistema de seguimiento de progreso
- [ ] Comunidad de usuarios
- [ ] Métricas avanzadas de performance

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Javier Navarro** - [GitHub](https://github.com/JavierNavarro12)

- 🌐 [Sitio Web](https://endlessgoalsnutrition.com/)
- 📧 Email: endlessgoalsnutrition@gmail.com
- 📍 Granada, España 🇪🇸

## 🙏 Agradecimientos

- [OpenAI](https://openai.com/) por proporcionar la API de IA
- [Firebase](https://firebase.google.com/) por la infraestructura backend
- [Contentful](https://www.contentful.com/) por el CMS headless para blogs
- [Netlify](https://netlify.com/) por el hosting y funciones serverless
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos

---

⭐ **Si este proyecto te ha sido útil, ¡dale una estrella en GitHub!**
