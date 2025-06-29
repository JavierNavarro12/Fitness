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

- �� **IA Personalizada**: Recomendaciones basadas en perfil completo del usuario
- 📊 **Reportes Profesionales**: Generación automática de informes detallados
- �� **Chat Inteligente**: Asistente virtual con contexto personalizado
- 📱 **PWA**: Aplicación web progresiva con funcionalidad offline
- 🌍 **Internacionalización**: Soporte completo para Español e Inglés
- 📄 **Exportación PDF**: Reportes descargables en formato profesional
- �� **Autenticación**: Sistema seguro con Firebase Auth
- �� **Historial**: Seguimiento de reportes y conversaciones

## ��️ Stack Tecnológico

### Frontend

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **React i18next** para internacionalización
- **AOS** para animaciones

### Backend & Servicios

- **Firebase** (Auth + Firestore)
- **OpenAI GPT-3.5** para IA
- **Netlify Functions** para API
- **Netlify** para hosting

### Herramientas

- **React PDF** para generación de documentos
- **React Markdown** para contenido
- **Jest & Testing Library** para testing

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
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id
OPENAI_API_KEY=tu_openai_key
```

**Nota:**  
Por motivos de seguridad, las credenciales **no están incluidas** en el repositorio.  
Debes crear tu propio proyecto en [Firebase](https://firebase.google.com/) y obtener una API key de [OpenAI](https://platform.openai.com/).

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecutar en modo desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar tests
npm run eject      # Eject (irreversible)
```

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

### 🚧 En Desarrollo

- [ ] Integración con wearables
- [ ] Sistema de seguimiento de progreso
- [ ] Comunidad de usuarios
- [ ] Tests automatizados completos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ��‍💻 Autor

**Javier Navarro** - [GitHub](https://github.com/JavierNavarro12)

- 🌐 [Sitio Web](https://endlessgoalsnutrition.com/)
- 📧 Email: endlessgoalsnutrition@gmail.com
- �� Granada, España 🇪🇸

## �� Agradecimientos

- [OpenAI](https://openai.com/) por proporcionar la API de IA
- [Firebase](https://firebase.google.com/) por la infraestructura backend
- [Netlify](https://netlify.com/) por el hosting y funciones serverless
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos

---

⭐ **Si este proyecto te ha sido útil, ¡dale una estrella en GitHub!**

<!-- Trigger CI/CD workflow -->
