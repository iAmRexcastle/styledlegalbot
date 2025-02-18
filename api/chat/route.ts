// api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

/**
 * POST /api/chat
 * 
 * This endpoint accepts a JSON payload with a `messages` array,
 * processes the messages via the AI SDK's streaming function,
 * and returns a streaming response.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the incoming JSON request body.
    const body = await request.json();

    // Validate that 'messages' exists and is an array.
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request: 'messages' field is required and must be an array.",
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Optional: You can add additional validation for message content here.

    // Call the AI SDK's streamText function with your configuration.
    const result = streamText({
      model: openai('gpt-4-turbo'),
      system: 'You are a friendly assistant!',
      messages: body.messages,
      maxSteps: 5, // Adjust as needed for multi-step interactions.
      // Optionally, define any tools or additional options here.
    });

    // Return the streaming response.
    // The toDataStreamResponse() method converts the stream into a Response object.
    return result.toDataStreamResponse();
  } catch (error: any) {
    // Log the error for debugging purposes.
    console.error('Error processing POST /api/chat:', error);

    // Return an internal server error response.
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}