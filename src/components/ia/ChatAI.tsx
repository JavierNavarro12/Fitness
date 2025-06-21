import React, { useState, useRef, useEffect } from 'react';

const ChatAI: React.FC = () => {
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

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Eres un experto en suplementación deportiva.' },
            { role: 'user', content: input }
          ],
          max_tokens: 500,
        }),
      });
      const data = await response.json();
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.choices?.[0]?.message?.content || 'Lo siento, no tengo respuesta en este momento.' },
      ]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Ocurrió un error al conectar con la IA.' },
      ]);
    }
    setLoading(false);
  };

  // Widget flotante
  return (
    <div>
      {/* Botón flotante para abrir/cerrar el chat */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-300 focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Abrir chat IA"
      >
        💬
      </button>
      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white rounded-2xl shadow-2xl border border-red-200 flex flex-col animate-fade-in">
          <div className="p-4 border-b border-red-100 bg-red-600 rounded-t-2xl text-white font-bold flex items-center justify-between">
            EGN IA
            <button onClick={() => setOpen(false)} className="text-white text-xl font-bold hover:text-red-200">×</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ minHeight: '320px', maxHeight: '60vh' }}>
            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-8">¡Hazme una pregunta sobre suplementación!</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-xl max-w-[80%] text-sm shadow ${msg.role === 'user' ? 'bg-red-100 text-red-900' : 'bg-gray-200 text-gray-800'}`}>
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
              placeholder="Pregúntame sobre suplementación..."
              disabled={loading}
            />
            <button
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 font-bold transition"
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

export default ChatAI; 