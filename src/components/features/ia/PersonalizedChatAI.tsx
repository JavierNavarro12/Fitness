import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../../types';

interface PersonalizedChatAIProps {
  userProfile: UserProfile | null;
}

const PersonalizedChatAI: React.FC<PersonalizedChatAIProps> = ({ userProfile }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const mapGender = (g: string) => {
    if (g === 'male') return 'Masculino';
    if (g === 'female') return 'Femenino';
    return 'Otro';
  };

  const mapExperience = (e: string) => {
    if (e === 'beginner') return 'Principiante';
    if (e === 'intermediate') return 'Intermedio';
    if (e === 'advanced') return 'Avanzado';
    return e;
  };

  const mapFrequency = (f: string) => {
    if (f === 'low') return 'Baja (1-2 veces/semana)';
    if (f === 'medium') return 'Media (3-4 veces/semana)';
    if (f === 'high') return 'Alta (5+ veces/semana)';
    return f;
  };

  const createUserContext = () => {
    if (!userProfile) {
      return "Eres un asistente experto en suplementación deportiva. Responde preguntas sobre suplementos, nutrición y fitness de manera profesional y educativa.";
    }

    return `Eres un asistente personal experto en suplementación deportiva. Tienes acceso al perfil del usuario:

PERFIL DEL USUARIO:
- Edad: ${userProfile.age} años
- Género: ${mapGender(userProfile.gender)}
- Peso: ${userProfile.weight} kg
- Altura: ${userProfile.height} cm
- Objetivo principal: ${userProfile.objective}
- Nivel de experiencia: ${mapExperience(userProfile.experience)}
- Frecuencia de entrenamiento: ${mapFrequency(userProfile.frequency)}
- Deporte principal: ${userProfile.sport}
- Condiciones médicas: ${userProfile.medicalConditions?.join(', ') || 'Ninguna'}
- Alergias: ${userProfile.allergies?.join(', ') || 'Ninguna'}
- Suplementos actuales: ${userProfile.currentSupplements?.join(', ') || 'Ninguno'}

INSTRUCCIONES:
- Siempre personaliza tus respuestas basándote en el perfil del usuario
- Considera sus objetivos, deporte, experiencia y condiciones médicas
- Da recomendaciones específicas y prácticas
- Si no tienes perfil del usuario, da consejos generales pero profesionales
- Mantén un tono motivador y educativo
- Responde en español de manera clara y concisa`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      // Crear el contexto personalizado
      const systemContext = createUserContext();
      
      const response = await fetch('/.netlify/functions/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemContext },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            userMessage
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.reply || 'Lo siento, no tengo respuesta en este momento.' },
      ]);
    } catch (e) {
      console.error(e);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Ocurrió un error al conectar con la IA.' },
      ]);
    }
    setLoading(false);
  };

  const getWelcomeMessage = () => {
    if (!userProfile) {
      return "¡Hola! Soy tu asistente de suplementación. Hazme cualquier pregunta sobre suplementos, nutrición o fitness.";
    }
    // Limpiar el deporte si viene con prefijo 'sports.'
    let cleanSport = userProfile.sport;
    if (cleanSport.startsWith('sports.')) {
      cleanSport = cleanSport.replace('sports.', '');
    }
    return `¡Hola! Soy tu asistente personal de suplementación.\n\nVeo que tu objetivo es ${userProfile.objective} y practicas ${cleanSport}.\n\n¿En qué puedo ayudarte hoy? Puedo darte recomendaciones personalizadas basadas en tu perfil.`;
  };

  // Widget flotante
  return (
    <div>
      {/* Botón flotante para abrir/cerrar el chat */}
      <button
        className="fixed right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-300 focus:outline-none bottom-24 sm:bottom-6"
        onClick={() => setOpen(o => !o)}
        aria-label="Abrir chat IA personalizado"
      >
        🤖
      </button>
      
      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white rounded-2xl shadow-2xl border border-red-200 flex flex-col animate-fade-in">
          <div className="p-4 border-b border-red-100 bg-red-600 rounded-t-2xl text-white font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>EGN IA Personal</span>
              {userProfile && (
                <span className="text-xs bg-red-500 px-2 py-1 rounded-full">
                  Personalizado
                </span>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="text-white text-xl font-bold hover:text-red-200">×</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ minHeight: '320px', maxHeight: '60vh' }}>
            {messages.length === 0 && (
              <div className="text-gray-600 text-sm leading-relaxed">
                {getWelcomeMessage()}
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-xl max-w-[80%] text-sm shadow ${msg.role === 'user' ? 'bg-red-100 text-red-900' : 'bg-white text-gray-800 border border-gray-200'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-red-100 bg-white flex gap-2">
            <input
              className="flex-1 border-2 border-red-200 rounded-xl p-2 focus:outline-none focus:border-red-500 transition"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
              placeholder={userProfile ? "¿Alguna duda?" : "Pregúntame sobre suplementación..."}
              disabled={loading}
            />
            <button
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 font-bold transition disabled:opacity-50"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedChatAI; 