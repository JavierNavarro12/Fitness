import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-4xl font-bold text-red-600 mb-6">¡Bienvenido a NutriMind!</h2>
      
      <div className="space-y-4 text-gray-700">
        <p className="text-lg">
          Tu asistente personal para encontrar los suplementos deportivos más adecuados para tus objetivos.
        </p>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-red-700 mb-3">¿Qué encontrarás aquí?</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Evaluación personalizada de tus necesidades</li>
            <li>Recomendaciones de suplementos basadas en tu perfil</li>
            <li>Información detallada sobre cada suplemento</li>
            <li>Consejos para optimizar tu suplementación</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          El proceso es simple: responderás algunas preguntas sobre tus objetivos y estilo de vida, y te proporcionaremos recomendaciones personalizadas.
        </p>
      </div>

      <button
        onClick={onStart}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
      >
        Comenzar Ahora
      </button>
    </div>
  );
};

export default Welcome; 