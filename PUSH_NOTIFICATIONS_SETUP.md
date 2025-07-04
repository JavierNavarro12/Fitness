# 🔔 Configuración de Notificaciones Push

## Resumen

Has implementado exitosamente un sistema completo de notificaciones push para tu app EGN Fitness. Este sistema incluye:

✅ **Notificaciones Locales**: Recordatorios de suplementos y logros  
✅ **Notificaciones Push**: Usando Firebase Cloud Messaging  
✅ **Componente de Gestión**: Interface para que el usuario configure las notificaciones  
✅ **Integración Completa**: Notificaciones cuando se generan reportes

## 📋 Configuración Necesaria

### 1. Firebase Cloud Messaging

Para activar las notificaciones push, necesitas configurar Firebase Cloud Messaging:

#### A. Obtener tu VAPID Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** > **Cloud Messaging**
4. En **Web configuration**, genera un **Web Push certificate**
5. Copia la **Key pair** (VAPID Key)

#### B. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Firebase Cloud Messaging
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key_here
```

#### C. Actualizar firebase-messaging-sw.js

Edita el archivo `public/firebase-messaging-sw.js` y reemplaza la configuración:

```javascript
const firebaseConfig = {
  apiKey: 'tu_api_key_real',
  authDomain: 'tu_proyecto.firebaseapp.com',
  projectId: 'tu_proyecto_id',
  storageBucket: 'tu_proyecto.appspot.com',
  messagingSenderId: 'tu_sender_id',
  appId: 'tu_app_id',
};
```

### 2. Dependencias

Las dependencias necesarias ya están incluidas en tu `package.json`:

```json
{
  "firebase": "^9.0.0"
}
```

### 3. Configurar Dominio

En Firebase Console:

1. Ve a **Project Settings** > **General**
2. En **Authorized domains**, agrega tu dominio de producción
3. Para desarrollo local, `localhost` debería estar incluido automáticamente

## 🚀 Cómo Funciona

### Tipos de Notificaciones

#### 1. **Recordatorios de Suplementos**

```javascript
// Ejemplo de uso:
notificationService.showSupplementReminder('Creatina', 'morning');
```

#### 2. **Notificaciones de Reportes**

```javascript
// Se dispara automáticamente cuando se genera un reporte
notificationService.showNewReportNotification('Suplementación Personalizada');
```

#### 3. **Notificaciones de Logros**

```javascript
// Para streak de días consecutivos
notificationService.showAchievementNotification('Racha de suplementos', 7);
```

### Componente de Gestión

El componente `NotificationManager` se muestra automáticamente en la sección **Personalización** cuando el usuario está logueado:

- ✅ Solicita permisos automáticamente
- ✅ Muestra estado actual de las notificaciones
- ✅ Permite probar notificaciones
- ✅ Configura recordatorios basados en el perfil del usuario

## 🔧 Personalización

### Agregar Nuevos Tipos de Notificaciones

1. **Crear el método en el servicio**:

```typescript
// En src/services/notificationService.ts
async showCustomNotification(title: string, body: string): Promise<boolean> {
  return this.showNotification({
    title,
    body,
    tag: 'custom-notification',
    data: { type: 'custom' },
    actions: [
      { action: 'view', title: 'Ver' },
      { action: 'close', title: 'Cerrar' }
    ]
  });
}
```

2. **Usar en tu componente**:

```typescript
import { notificationService } from '../services/notificationService';

// En cualquier componente
const showCustomNotification = async () => {
  await notificationService.showCustomNotification(
    'Título personalizado',
    'Mensaje personalizado'
  );
};
```

### Configurar Horarios Automáticos

Para crear recordatorios automáticos, puedes usar:

```typescript
// Ejemplo: Recordatorio diario a las 8:00 AM
const scheduleDaily = () => {
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(8, 0, 0, 0);

  // Si ya pasó hoy, programar para mañana
  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const delay = targetTime.getTime() - now.getTime();

  setTimeout(() => {
    notificationService.showSupplementReminder('Proteína', 'morning');
    scheduleDaily(); // Programar el siguiente
  }, delay);
};
```

## 📱 Compatibilidad

### Navegadores Soportados

| Navegador          | Soporte     |
| ------------------ | ----------- |
| Chrome (Android)   | ✅ Completo |
| Firefox (Android)  | ✅ Completo |
| Safari (iOS 16.4+) | ✅ Completo |
| Samsung Internet   | ✅ Completo |
| Chrome (Desktop)   | ✅ Completo |
| Firefox (Desktop)  | ✅ Completo |
| Safari (Desktop)   | ✅ Completo |

### Limitaciones

- **iOS < 16.4**: No soporta notificaciones push en PWAs
- **Notificaciones programadas**: Solo disponibles en apps nativas
- **Notificaciones offline**: Solo las que estén ya programadas

## 🔐 Seguridad

### Mejores Prácticas

1. **Validar permisos**: Siempre verifica que el usuario haya dado permisos
2. **No spam**: Limita la frecuencia de notificaciones
3. **Relevancia**: Solo envía notificaciones útiles para el usuario
4. **Privacidad**: No incluyas información sensible en las notificaciones

### Ejemplo de Validación

```typescript
// Verificar permisos antes de enviar
if (notificationService.hasPermission()) {
  await notificationService.showNotification({
    title: 'Título',
    body: 'Mensaje',
  });
} else {
  console.log('Usuario no ha dado permisos de notificación');
}
```

## 🧪 Testing

### Probar Notificaciones

1. **Activar notificaciones** en el componente
2. **Usar el botón "Probar Notificación"** en la configuración
3. **Generar un reporte** para ver la notificación automática
4. **Verificar en diferentes navegadores**

### Debugging

```typescript
// Verificar estado del servicio
console.log('Permisos:', Notification.permission);
console.log('Service Worker:', 'serviceWorker' in navigator);
console.log('Notificaciones:', 'Notification' in window);
```

## 🚀 Próximos Pasos

### Funcionalidades Avanzadas

1. **Notificaciones Programadas**: Usar un servidor para enviar notificaciones en horarios específicos
2. **Segmentación**: Diferentes notificaciones según el perfil del usuario
3. **Analytics**: Tracking de apertura y interacción con notificaciones
4. **A/B Testing**: Probar diferentes mensajes y horarios

### Integración con Backend

Para notificaciones más avanzadas, considera:

1. **Servidor de Notificaciones**: Using Firebase Functions o servidor propio
2. **Base de Datos**: Guardar preferencias y historial de notificaciones
3. **Cron Jobs**: Para notificaciones programadas
4. **Analytics**: Métricas de engagement

## 🆘 Solución de Problemas

### Problemas Comunes

1. **"Notificaciones no aparecen"**
   - Verificar permisos del navegador
   - Comprobar configuración de Firebase
   - Revisar consola por errores

2. **"VAPID Key no funciona"**
   - Asegurarte de que la key esté en el archivo `.env`
   - Verificar que la key sea correcta en Firebase Console

3. **"Service Worker no se registra"**
   - Verificar que el archivo exista en `public/`
   - Comprobar errores en la consola del navegador

4. **"Notificaciones no aparecen en iPhone"**
   - Verificar versión de iOS (necesita 16.4+)
   - Confirmar que la app esté instalada como PWA

### Logs Útiles

```typescript
// Para debugging
console.log('Messaging initialized:', getMessagingInstance());
console.log('Device token:', await notificationService.getDeviceToken());
console.log('Permission status:', Notification.permission);
```

## 📞 Soporte

Si tienes problemas con la implementación:

1. Revisa la consola del navegador por errores
2. Verifica la configuración de Firebase
3. Comprueba que todas las variables de entorno estén configuradas
4. Asegúrate de que el dominio esté autorizado en Firebase

¡Tu sistema de notificaciones está listo para usar! 🎉
