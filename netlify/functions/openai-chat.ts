import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Maneja preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body || '{}');

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Invalid request body, "messages" array is required.',
        }),
      };
    }

    const start = Date.now();
    console.log('Calling OpenAI API at:', new Date(start).toISOString());

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en suplementación deportiva especializado en crear recomendaciones personalizadas basadas en los objetivos, características físicas y preferencias del usuario.

IMPORTANTE: Debes estructurar tu respuesta usando EXACTAMENTE este formato para cada suplemento recomendado:

## Nombre del Suplemento
Dosis recomendada: [cantidad específica]
Momento de toma: [cuándo tomarlo]
Notas: [interacciones, precauciones o información adicional importante]

INSTRUCCIONES ESPECÍFICAS:
- Usa "##" seguido de un espacio para cada nombre de suplemento
- Usa exactamente "Dosis recomendada:", "Momento de toma:" y "Notas:" como etiquetas
- Sé específico en las dosis (ej: "3-5g", "200-400mg", "1 scoop")
- Incluye timing específico (ej: "30 minutos antes del entrenamiento", "con las comidas")
- En las notas, menciona interacciones importantes, precauciones o si se debe ciclar

Proporciona recomendaciones basadas en evidencia científica, considerando siempre la seguridad del usuario y adaptando las sugerencias a sus objetivos específicos.`,
        },
        ...messages,
      ],
      max_tokens: 1000,
    });

    const end = Date.now();
    console.log(
      'OpenAI API response received at:',
      new Date(end).toISOString()
    );
    console.log('OpenAI API duration (ms):', end - start);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reply: completion.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Failed to get response from AI.' }),
    };
  }
};

export { handler };
