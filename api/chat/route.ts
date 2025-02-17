// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request: Request) {
  const { messages } = await request.json();
  
  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a friendly assistant!',
    messages,
    // You can define tools here if needed
    maxSteps: 5, // For multi-step calls, if applicable
  });
  
  return result.toDataStreamResponse();
}