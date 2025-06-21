import React from 'react';
import { useTranslation } from 'react-i18next';

const Privacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-red-700 dark:text-red-300 mb-4">
          {t('Política de Privacidad')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8" data-aos="fade-up">
        
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            1. Información que Recopilamos
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Información Personal
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Datos de perfil: edad, género, peso, altura, deporte, experiencia
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Información de contacto: email (para autenticación)
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Información médica: condiciones médicas, alergias, suplementos actuales
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Información de Uso
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Historial de informes generados
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Preferencias de la aplicación
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Datos de navegación y uso de la plataforma
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            2. Cómo Utilizamos tu Información
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Generar recomendaciones personalizadas de suplementación
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Mejorar nuestros algoritmos y servicios
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Proporcionar soporte al cliente
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Enviar actualizaciones importantes sobre el servicio
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Cumplir con obligaciones legales
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            3. Compartir Información
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            <strong>No vendemos, alquilamos ni compartimos tu información personal</strong> con terceros, excepto en los siguientes casos:
          </p>
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Con tu consentimiento explícito
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Para cumplir con obligaciones legales
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Con proveedores de servicios que nos ayudan a operar la plataforma (bajo estrictos acuerdos de confidencialidad)
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • En caso de emergencia médica (solo información relevante)
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            4. Seguridad de Datos
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
            </p>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Encriptación de datos en tránsito y en reposo
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Acceso restringido a información personal
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Monitoreo regular de seguridad
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                • Copias de seguridad seguras
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            5. Tus Derechos
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • <strong>Acceso:</strong> Puedes solicitar una copia de tus datos personales
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • <strong>Rectificación:</strong> Puedes corregir información inexacta
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • <strong>Eliminación:</strong> Puedes solicitar la eliminación de tus datos
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • <strong>Portabilidad:</strong> Puedes solicitar la transferencia de tus datos
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • <strong>Oposición:</strong> Puedes oponerte al procesamiento de tus datos
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            6. Retención de Datos
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Conservamos tu información personal únicamente durante el tiempo necesario para cumplir con los 
            propósitos descritos en esta política, o según lo requiera la ley. Los datos se eliminan de 
            forma segura cuando ya no son necesarios.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            7. Cookies y Tecnologías Similares
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la 
            aplicación y personalizar el contenido. Puedes controlar el uso de cookies a través de la 
            configuración de tu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            8. Menores de Edad
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Nuestro servicio no está dirigido a menores de 18 años. No recopilamos intencionalmente 
            información personal de menores. Si eres padre o tutor y crees que tu hijo nos ha proporcionado 
            información, contáctanos inmediatamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            9. Cambios en esta Política
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios 
            significativos por email o a través de la aplicación. Te recomendamos revisar esta política 
            periódicamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            10. Contacto
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos, 
            puedes contactarnos en:
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
            Email: endlessgoalsnutrition@gmail.com
          </p>
        </section>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
            Compromiso con tu Privacidad
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            En EGN Fitness, tu privacidad es fundamental. Nos comprometemos a proteger tu información 
            personal y a ser transparentes sobre cómo la utilizamos. Si tienes alguna preocupación, 
            no dudes en contactarnos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 