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

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
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
        body: JSON.stringify({ error: 'Invalid request body, "messages" array is required.' }),
      };
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Eres un experto en suplementación deportiva.' },
        ...messages
      ],
      max_tokens: 1000,
    });

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
