import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../../types';
import { useTranslation } from 'react-i18next';
import { db, auth } from '../../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FaTrash } from 'react-icons/fa';

interface PersonalizedChatAIProps {
  userProfile: UserProfile | null;
  mobileMenuOpen?: boolean;
}

const PersonalizedChatAI: React.FC<PersonalizedChatAIProps> = ({ userProfile, mobileMenuOpen }) => {
  const { i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    if (open && messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (mobileMenuOpen && open) {
      setOpen(false);
    }
  }, [mobileMenuOpen, open]);

  // Detectar usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  // Cargar historial de Firestore
  const loadHistory = async () => {
    if (!userId) return;
    setHistoryLoading(true);
    const q = query(
      collection(db, 'chatHistories'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setChatHistory(history);
    setHistoryLoading(false);
  };

  // Guardar conversación en Firestore
  const saveChatToHistory = async (msgs: any[]) => {
    if (!userId || msgs.length === 0) return;
    
    if (currentChatId) {
      // Actualizar chat existente
      await updateDoc(doc(db, 'chatHistories', currentChatId), {
        messages: msgs,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Crear nuevo chat
      const docRef = await addDoc(collection(db, 'chatHistories'), {
        userId,
        messages: msgs,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        title: msgs[0]?.content?.slice(0, 40) || 'Chat',
      });
      setCurrentChatId(docRef.id);
    }
    loadHistory();
  };

  // Borrar chat del historial
  const deleteChat = async (id: string) => {
    await deleteDoc(doc(db, 'chatHistories', id));
    // Si borramos el chat actual, limpiar el estado
    if (id === currentChatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
    loadHistory();
  };

  // Continuar conversación del historial
  const continueChat = (chat: any) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setShowHistory(false);
    setSelectedChat(null);
  };

  // Iniciar nuevo chat
  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setShowHistory(false);
    setSelectedChat(null);
  };

  const mapGender = (g: string) => {
    if (i18n.language === 'en') {
      if (g === 'male') return 'Male';
      if (g === 'female') return 'Female';
      return 'Other';
    }
    if (g === 'male') return 'Masculino';
    if (g === 'female') return 'Femenino';
    return 'Otro';
  };

  const mapExperience = (e: string) => {
    if (i18n.language === 'en') {
      if (e === 'beginner') return 'Beginner';
      if (e === 'intermediate') return 'Intermediate';
      if (e === 'advanced') return 'Advanced';
      return e;
    }
    if (e === 'beginner') return 'Principiante';
    if (e === 'intermediate') return 'Intermedio';
    if (e === 'advanced') return 'Avanzado';
    return e;
  };

  const mapFrequency = (f: string) => {
    if (i18n.language === 'en') {
      if (f === 'low') return 'Low (1-2 times/week)';
      if (f === 'medium') return 'Medium (3-4 times/week)';
      if (f === 'high') return 'High (5+ times/week)';
      return f;
    }
    if (f === 'low') return 'Baja (1-2 veces/semana)';
    if (f === 'medium') return 'Media (3-4 veces/semana)';
    if (f === 'high') return 'Alta (5+ veces/semana)';
    return f;
  };

  const createUserContext = () => {
    if (i18n.language === 'en') {
      if (!userProfile) {
        return "You are an expert assistant in sports supplementation. Answer questions about supplements, nutrition, and fitness in a professional and educational manner.";
      }
      return `You are a personal expert assistant in sports supplementation. You have access to the user's profile:

USER PROFILE:
- Age: ${userProfile.age} years
- Gender: ${mapGender(userProfile.gender)}
- Weight: ${userProfile.weight} kg
- Height: ${userProfile.height} cm
- Main goal: ${userProfile.objective}
- Experience level: ${mapExperience(userProfile.experience)}
- Training frequency: ${mapFrequency(userProfile.frequency)}
- Main sport: ${userProfile.sport}
- Medical conditions: ${userProfile.medicalConditions?.join(', ') || 'None'}
- Allergies: ${userProfile.allergies?.join(', ') || 'None'}
- Current supplements: ${userProfile.currentSupplements?.join(', ') || 'None'}

INSTRUCTIONS:
- Always personalize your answers based on the user's profile
- Consider their goals, sport, experience, and medical conditions
- Give specific and practical recommendations
- If you don't have a user profile, give general but professional advice
- Keep a motivating and educational tone
- Answer in clear and concise English`;
    }
    // Español
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
      const updatedMessages = [
        ...newMessages,
        { role: 'assistant', content: data.reply || (i18n.language === 'en' ? 'Sorry, I have no answer at the moment.' : 'Lo siento, no tengo respuesta en este momento.') },
      ];
      setMessages(updatedMessages);
      // Guardar historial cada vez que se envía un mensaje
      saveChatToHistory(updatedMessages);
    } catch (e) {
      console.error(e);
      const updatedMessages = [
        ...newMessages,
        { role: 'assistant', content: i18n.language === 'en' ? 'An error occurred while connecting to the AI.' : 'Ocurrió un error al conectar con la IA.' },
      ];
      setMessages(updatedMessages);
      saveChatToHistory(updatedMessages);
    }
    setLoading(false);
  };

  const getWelcomeMessage = () => {
    if (i18n.language === 'en') {
      if (!userProfile) {
        return "Hi! I'm your supplementation assistant. Ask me anything about supplements, nutrition, or fitness.";
      }
      // Clean sport if it starts with 'sports.'
      let cleanSport = userProfile.sport;
      if (cleanSport.startsWith('sports.')) {
        cleanSport = cleanSport.replace('sports.', '');
      }
      return `Hi! I'm your personal supplementation assistant.\n\nI see your goal is ${userProfile.objective} and you practice ${cleanSport}.\n\nHow can I help you today? I can give you personalized recommendations based on your profile.`;
    }
    // Español
    if (!userProfile) {
      return "¡Hola! Soy tu asistente de suplementación. Hazme cualquier pregunta sobre suplementos, nutrición o fitness.";
    }
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
      {!mobileMenuOpen && (
      <button
          className="fixed right-6 bottom-24 sm:right-16 sm:bottom-10 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-300 focus:outline-none"
          onClick={() => { setOpen(o => !o); if (!open) { setShowHistory(false); setSelectedChat(null); } }}
          aria-label={i18n.language === 'en' ? 'Open personalized AI chat' : 'Abrir chat IA personalizado'}
      >
        🤖
      </button>
      )}
      {/* Ventana de chat */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
          <div className="fixed left-1/2 bottom-40 sm:right-16 sm:left-auto sm:bottom-28 z-50 w-[98vw] max-w-lg sm:w-[32rem] bg-white rounded-2xl shadow-2xl border border-red-200 flex flex-col animate-fade-in overflow-hidden -translate-x-1/2 sm:translate-x-0">
            {/* Header con botón historial */}
          <div className="p-4 border-b border-red-100 bg-red-600 rounded-t-2xl text-white font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>EGN IA Personal</span>
              {currentChatId && (
                <span className="text-xs bg-red-500 px-2 py-1 rounded-full">
                  {i18n.language === 'en' ? 'Continuing' : 'Continuando'}
                </span>
              )}
            </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!showHistory) loadHistory();
                    setShowHistory(h => !h);
                    setSelectedChat(null);
                  }}
                  className="text-white text-xl font-bold hover:text-red-200 focus:outline-none mr-2"
                  title={i18n.language === 'en' ? 'History' : 'Historial'}
                  aria-label={i18n.language === 'en' ? 'History' : 'Historial'}
                >
                  <img src="/history.png" alt="Historial" className="w-7 h-7 object-contain" />
                </button>
                <button
                  className="text-xs text-blue-100 hover:underline mr-2"
                  onClick={startNewChat}
                >
                  {i18n.language === 'en' ? 'New chat' : 'Nuevo chat'}
                </button>
            <button onClick={() => setOpen(false)} className="text-white text-xl font-bold hover:text-red-200">×</button>
              </div>
          </div>
          
            {/* Panel de historial */}
            {showHistory ? (
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ minHeight: '320px', maxHeight: '75vh' }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">{i18n.language === 'en' ? 'Chat History' : 'Historial de chats'}</span>
                  <button className="text-xs text-red-600 hover:underline" onClick={() => setShowHistory(false)}>{i18n.language === 'en' ? 'Back to chat' : 'Volver al chat'}</button>
                </div>
                {historyLoading ? (
                  <div className="text-gray-500 text-sm">{i18n.language === 'en' ? 'Loading...' : 'Cargando...'}</div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-gray-500 text-sm">{i18n.language === 'en' ? 'No history yet.' : 'Sin historial aún.'}</div>
                ) : (
                  <ul className="space-y-2">
                    {chatHistory.map(chat => (
                      <li key={chat.id} className="flex flex-row items-center bg-white border border-red-100 rounded-lg px-3 py-2 hover:bg-red-50 transition">
                        <span 
                          onClick={() => setSelectedChat(chat)} 
                          className="flex-1 truncate cursor-pointer"
                        >
                          {chat.title || (i18n.language === 'en' ? 'Chat' : 'Chat')}
                        </span>
                        <div className="flex gap-2 ml-2">
                          <button 
                            onClick={() => continueChat(chat)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                            title={i18n.language === 'en' ? 'Continue this chat' : 'Continuar este chat'}
                          >
                            {i18n.language === 'en' ? 'Continue' : 'Continuar'}
                          </button>
                          <button 
                            onClick={() => deleteChat(chat.id)} 
                            className="text-red-500 hover:text-red-700 text-lg px-2" 
                            title={i18n.language === 'en' ? 'Delete' : 'Borrar'}
                          >
                            {FaTrash({ className: "w-5 h-5" })}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Mostrar chat seleccionado */}
                {selectedChat && (
                  <div className="mt-4 bg-white border border-red-100 rounded-lg p-3 max-h-60 overflow-y-auto">
                    <div className="mb-2 font-semibold text-gray-700">{i18n.language === 'en' ? 'Conversation' : 'Conversación'}</div>
                    <div className="space-y-2 text-sm">
                      {selectedChat.messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`px-3 py-1 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-red-100 text-red-900' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>{msg.content}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 font-bold transition" 
                        onClick={() => continueChat(selectedChat)}
                      >
                        {i18n.language === 'en' ? 'Continue' : 'Continuar'}
                      </button>
                      <button 
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-xl px-4 py-2 font-bold transition" 
                        onClick={() => setSelectedChat(null)}
                      >
                        {i18n.language === 'en' ? 'Back' : 'Volver'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
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
                <div className="p-3 border-t border-red-100 flex gap-2 rounded-b-2xl">
            <input
              className="flex-1 border-2 border-red-200 rounded-xl p-2 focus:outline-none focus:border-red-500 transition"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder={userProfile ? (i18n.language === 'en' ? 'Any questions?' : '¿Alguna duda?') : (i18n.language === 'en' ? 'Ask me about supplementation...' : 'Pregúntame sobre suplementación...')}
              disabled={loading}
            />
            <button
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 font-bold transition disabled:opacity-50"
              onClick={sendMessage}
              disabled={loading}
            >
                    {loading ? (i18n.language === 'en' ? '...' : '...') : (i18n.language === 'en' ? 'Send' : 'Enviar')}
            </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalizedChatAI; 