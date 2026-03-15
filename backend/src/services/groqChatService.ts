import { RetrievalMatch } from './pythonBridgeService';

export interface ChatAnswer {
  answer: string;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b';

export async function generateGroundedAnswer(params: {
  message: string;
  contextMatches: RetrievalMatch[];
}): Promise<ChatAnswer> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const context = params.contextMatches
    .map((match, index) => {
      return [`Source ${index + 1}: ${match.file_name}`, match.text].join('\n');
    })
    .join('\n\n');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You answer questions using only the supplied context from the user\'s indexed knowledge base. If the context is insufficient, say so plainly. Keep answers concise and practical.',
        },
        {
          role: 'user',
          content: `Question:\n${params.message}\n\nContext:\n${context}`,
        },
      ],
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Groq request failed');
  }

  const answer = payload?.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    throw new Error('Groq returned an empty response');
  }

  return { answer };
}