import React from 'react';
import { useTranslation } from 'react-i18next';

const Terms: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-red-700 dark:text-red-300 mb-4">
          {t('Términos de Servicio')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8" data-aos="fade-up">
        
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            1. Aceptación de los Términos
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Al acceder y utilizar EGN Fitness (Endless Goals Nutrition), aceptas estar sujeto a estos Términos de Servicio. 
            Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            2. Descripción del Servicio
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            EGN Fitness es una plataforma de asesoramiento en suplementación deportiva que utiliza inteligencia artificial 
            para proporcionar recomendaciones personalizadas basadas en tu perfil y objetivos.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <strong>Importante:</strong> Nuestras recomendaciones son informativas y no sustituyen el consejo médico profesional. 
            Siempre consulta con un profesional de la salud antes de comenzar cualquier suplementación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            3. Uso Responsable
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Debes proporcionar información precisa y actualizada en tu perfil
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • No debes usar el servicio si tienes menos de 18 años sin supervisión parental
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Eres responsable de consultar con profesionales de la salud antes de seguir nuestras recomendaciones
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • No debes usar el servicio para fines ilegales o no autorizados
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            4. Limitaciones de Responsabilidad
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            EGN Fitness no se hace responsable de:
          </p>
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Cualquier efecto adverso derivado del uso de suplementos recomendados
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Interacciones con medicamentos o condiciones médicas existentes
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Resultados específicos de rendimiento o salud
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Interrupciones del servicio o pérdida de datos
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            5. Privacidad y Datos
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Tu privacidad es importante para nosotros. Recopilamos y procesamos datos personales únicamente para 
            proporcionar nuestros servicios. Consulta nuestra Política de Privacidad para más detalles sobre 
            cómo manejamos tu información.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            6. Propiedad Intelectual
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Todo el contenido, algoritmos y tecnología de EGN Fitness están protegidos por derechos de autor 
            y otras leyes de propiedad intelectual. No está permitido copiar, distribuir o modificar nuestro 
            contenido sin autorización.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            7. Modificaciones
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán 
            en vigor inmediatamente después de su publicación. Te recomendamos revisar estos términos periódicamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            8. Contacto
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Si tienes preguntas sobre estos términos, puedes contactarnos en:
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
            Email: endlessgoalsnutrition@gmail.com
          </p>
        </section>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
            Aviso Legal Importante
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Las recomendaciones proporcionadas por EGN Fitness son únicamente informativas y educativas. 
            No constituyen consejo médico, diagnóstico o tratamiento. Siempre consulta con un profesional 
            de la salud calificado antes de comenzar cualquier programa de suplementación.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms; 