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
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FaTrash } from 'react-icons/fa';

interface PersonalizedChatAIProps {
  userProfile: UserProfile | null;
  mobileMenuOpen?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  isPageContent?: boolean;
  user?: any;
}

const PersonalizedChatAI: React.FC<PersonalizedChatAIProps> = ({
  userProfile,
  mobileMenuOpen,
  isMobile = false,
  isOpen = false,
  onClose,
  isPageContent = false,
  user,
}) => {
  const { i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
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
    if (isMobile) {
      setOpen(isOpen);
    } else if (isPageContent) {
      // Si es contenido de página, siempre debe estar abierto
      setOpen(true);
    }
  }, [isMobile, isOpen, isPageContent]);

  useEffect(() => {
    if (
      open &&
      messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView
    ) {
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
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUserId(user ? user.uid : null);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
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
        return 'You are an expert assistant in sports supplementation. Answer questions about supplements, nutrition, and fitness in a professional and educational manner.';
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
      return 'Eres un asistente experto en suplementación deportiva. Responde preguntas sobre suplementos, nutrición y fitness de manera profesional y educativa.';
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
            userMessage,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const updatedMessages = [
        ...newMessages,
        {
          role: 'assistant',
          content:
            data.reply ||
            (i18n.language === 'en'
              ? 'Sorry, I have no answer at the moment.'
              : 'Lo siento, no tengo respuesta en este momento.'),
        },
      ];
      setMessages(updatedMessages);
      // Guardar historial cada vez que se envía un mensaje
      saveChatToHistory(updatedMessages);
    } catch (e) {
      console.error(e);
      const updatedMessages = [
        ...newMessages,
        {
          role: 'assistant',
          content:
            i18n.language === 'en'
              ? 'An error occurred while connecting to the AI.'
              : 'Ocurrió un error al conectar con la IA.',
        },
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
      return '¡Hola! Soy tu asistente de suplementación. Hazme cualquier pregunta sobre suplementos, nutrición o fitness.';
    }
    let cleanSport = userProfile.sport;
    if (cleanSport.startsWith('sports.')) {
      cleanSport = cleanSport.replace('sports.', '');
    }
    return `¡Hola! Soy tu asistente personal de suplementación.\n\nVeo que tu objetivo es ${userProfile.objective} y practicas ${cleanSport}.\n\n¿En qué puedo ayudarte hoy? Puedo darte recomendaciones personalizadas basadas en tu perfil.`;
  };

  const handleClose = () => {
    if (isMobile && onClose) {
      onClose();
    } else {
      setOpen(false);
    }
  };

  // Widget flotante
  return (
    <div className={isPageContent ? 'h-full flex flex-col flex-1' : ''}>
      {/* Botón flotante para abrir/cerrar el chat - solo mostrar en desktop */}
      {!mobileMenuOpen && !isMobile && !isPageContent && (
        <button
          className='fixed right-6 bottom-24 sm:right-16 sm:bottom-10 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-300 focus:outline-none'
          onClick={() => {
            setOpen(o => !o);
            if (!open) {
              setShowHistory(false);
              setSelectedChat(null);
            }
          }}
          aria-label={
            i18n.language === 'en'
              ? 'Open personalized AI chat'
              : 'Abrir chat IA personalizado'
          }
        >
          🤖
        </button>
      )}
      {/* Ventana de chat */}
      {(open || isPageContent) && (
        <>
          {/* Solo mostrar overlay si no es contenido de página */}
          {!isPageContent && (
            <div
              className={`fixed ${isMobile ? 'inset-x-0 top-14 bottom-20' : 'inset-0'} bg-black/20 backdrop-blur-sm z-[45]`}
              data-testid='personalized-chat-overlay'
            />
          )}
          <div
            className={`
              ${
                isPageContent
                  ? isMobile
                    ? 'fixed top-16 left-0 right-0 bottom-20 flex flex-col bg-white dark:bg-gray-800 rounded-t-lg rounded-b-2xl'
                    : 'h-full flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-red-200 dark:border-red-700'
                  : `fixed ${isMobile ? 'left-4 right-4 top-[4.5rem] bottom-24' : 'left-1/2 bottom-40 sm:right-16 sm:left-auto sm:bottom-28'} z-[45] w-auto max-w-lg sm:w-[32rem] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-red-200 dark:border-red-700`
              }
              flex flex-col animate-fade-in overflow-hidden 
              ${!isMobile && !isPageContent && '-translate-x-1/2 sm:translate-x-0'}
            `}
          >
            {/* Header con botón historial */}
            <div className='px-4 py-3 border-b border-red-100 dark:border-red-700 bg-red-600 text-white font-bold flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span className='text-lg'>EGN IA Personal</span>
                {currentChatId && (
                  <span className='text-xs bg-red-500 px-3 py-1 rounded-full'>
                    {i18n.language === 'en' ? 'Continuing' : 'Continuando'}
                  </span>
                )}
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => {
                    if (!showHistory) loadHistory();
                    setShowHistory(h => !h);
                    setSelectedChat(null);
                  }}
                  className='text-white text-xl font-bold hover:text-red-200 focus:outline-none'
                  title={i18n.language === 'en' ? 'History' : 'Historial'}
                  aria-label={i18n.language === 'en' ? 'History' : 'Historial'}
                >
                  <img
                    src='/history.png'
                    alt='Historial'
                    className='w-7 h-7 object-contain'
                  />
                </button>
                <button
                  className='text-sm text-blue-200 hover:underline'
                  onClick={startNewChat}
                >
                  {i18n.language === 'en' ? 'New chat' : 'Nuevo chat'}
                </button>
                {!isPageContent && (
                  <button
                    onClick={handleClose}
                    className='text-white text-2xl font-bold hover:text-red-200'
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {showHistory ? (
              <div
                className='flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900'
                style={{
                  minHeight: isPageContent ? 'auto' : '200px',
                  maxHeight: isPageContent ? 'none' : '75vh',
                }}
              >
                <div className='mb-2 flex items-center justify-between'>
                  <span className='font-semibold text-gray-700 dark:text-gray-300'>
                    {i18n.language === 'en'
                      ? 'Chat History'
                      : 'Historial de chats'}
                  </span>
                  <button
                    className='text-xs text-red-600 hover:underline'
                    onClick={() => setShowHistory(false)}
                  >
                    {i18n.language === 'en' ? 'Back to chat' : 'Volver al chat'}
                  </button>
                </div>
                {historyLoading ? (
                  <div className='text-gray-500 dark:text-gray-400 text-sm'>
                    {i18n.language === 'en' ? 'Loading...' : 'Cargando...'}
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className='text-gray-500 dark:text-gray-400 text-sm'>
                    {i18n.language === 'en'
                      ? 'No history yet.'
                      : 'Sin historial aún.'}
                  </div>
                ) : (
                  <ul className='space-y-2'>
                    {chatHistory.map(chat => (
                      <li
                        key={chat.id}
                        className='flex flex-row items-center bg-white dark:bg-gray-800 border border-red-100 dark:border-red-700 rounded-lg px-3 py-2 hover:bg-red-50 dark:hover:bg-gray-700 transition'
                      >
                        <span
                          onClick={() => setSelectedChat(chat)}
                          className='flex-1 truncate cursor-pointer'
                        >
                          {chat.title ||
                            (i18n.language === 'en' ? 'Chat' : 'Chat')}
                        </span>
                        <div className='flex gap-2 ml-2'>
                          <button
                            onClick={() => continueChat(chat)}
                            className='text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition'
                            title={
                              i18n.language === 'en'
                                ? 'Continue this chat'
                                : 'Continuar este chat'
                            }
                          >
                            {i18n.language === 'en' ? 'Continue' : 'Continuar'}
                          </button>
                          <button
                            onClick={() => deleteChat(chat.id)}
                            className='text-red-500 hover:text-red-700 text-lg px-2'
                            title={i18n.language === 'en' ? 'Delete' : 'Borrar'}
                          >
                            {FaTrash({ className: 'w-5 h-5' })}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Mostrar chat seleccionado */}
                {selectedChat && (
                  <div className='mt-4 bg-white dark:bg-gray-800 border border-red-100 dark:border-red-700 rounded-lg p-3 max-h-60 overflow-y-auto'>
                    <div className='mb-2 font-semibold text-gray-700 dark:text-gray-300'>
                      {i18n.language === 'en' ? 'Conversation' : 'Conversación'}
                    </div>
                    <div className='space-y-3 text-sm'>
                      {selectedChat.messages.map((msg: any, i: number) => (
                        <div
                          key={i}
                          className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {/* Avatar para IA en historial */}
                          {msg.role === 'assistant' && (
                            <div className='w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0'>
                              <span className='text-white text-xs font-bold'>
                                AI
                              </span>
                            </div>
                          )}

                          <div
                            className={`px-3 py-2 rounded-xl max-w-[75%] ${
                              msg.role === 'user'
                                ? 'bg-blue-500 text-white rounded-br-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                            }`}
                          >
                            {msg.content}
                          </div>

                          {/* Avatar para usuario en historial */}
                          {msg.role === 'user' && (
                            <div className='w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0'>
                              <span className='text-gray-600 dark:text-gray-400 text-xs'>
                                👤
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className='mt-3 flex gap-2'>
                      <button
                        className='flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 font-bold transition'
                        onClick={() => continueChat(selectedChat)}
                      >
                        {i18n.language === 'en' ? 'Continue' : 'Continuar'}
                      </button>
                      <button
                        className='flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-xl px-4 py-2 font-bold transition'
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
                <div
                  className='flex-1 p-2 overflow-y-auto bg-gray-50 dark:bg-gray-900'
                  style={{
                    minHeight: isPageContent ? 'auto' : '150px',
                    maxHeight: isPageContent ? 'none' : '60vh',
                  }}
                >
                  {/* Mensaje de bienvenida siempre visible */}
                  <div className='mb-4 flex items-end gap-2 justify-start'>
                    {/* Avatar para IA */}
                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 mb-1'>
                      <span className='text-white text-sm font-bold'>AI</span>
                    </div>

                    {/* Bocadillo del mensaje de bienvenida */}
                    <div className='px-4 py-3 rounded-2xl rounded-bl-md max-w-[75%] text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'>
                      <div className='whitespace-pre-wrap'>
                        {getWelcomeMessage()}
                      </div>
                    </div>
                  </div>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-4 flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Avatar para IA (lado izquierdo) */}
                      {msg.role === 'assistant' && (
                        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 mb-1'>
                          <span className='text-white text-sm font-bold'>
                            AI
                          </span>
                        </div>
                      )}

                      {/* Bocadillo del mensaje */}
                      <div
                        className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md'
                        }`}
                      >
                        <div className='whitespace-pre-wrap'>{msg.content}</div>
                      </div>

                      {/* Avatar para usuario (lado derecho) */}
                      {msg.role === 'user' && (
                        <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mb-1 overflow-hidden'>
                          {user?.photoURL || userProfile?.photo ? (
                            <img
                              src={user?.photoURL || userProfile?.photo}
                              alt='Usuario'
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <span className='text-gray-600 dark:text-gray-400 text-sm font-bold'>
                              {user?.displayName?.[0]?.toUpperCase() ||
                                user?.email?.[0]?.toUpperCase() ||
                                '👤'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className='flex gap-2 px-3 py-3 border-t border-red-100 dark:border-red-700 bg-white dark:bg-gray-800'>
                  <input
                    className='flex-1 border border-red-200 dark:border-red-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 transition text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e =>
                      e.key === 'Enter' && !loading && sendMessage()
                    }
                    placeholder={
                      userProfile
                        ? i18n.language === 'en'
                          ? 'Any questions?'
                          : '¿Alguna duda?'
                        : i18n.language === 'en'
                          ? 'Ask me about supplementation...'
                          : 'Pregúntame sobre suplementación...'
                    }
                    disabled={loading}
                  />
                  <button
                    className='bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-2.5 font-medium transition disabled:opacity-50 text-base whitespace-nowrap'
                    onClick={sendMessage}
                    disabled={loading}
                  >
                    {loading
                      ? i18n.language === 'en'
                        ? '...'
                        : '...'
                      : i18n.language === 'en'
                        ? 'Send'
                        : 'Enviar'}
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
