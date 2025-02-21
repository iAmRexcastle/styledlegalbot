// app/api/lead/summary/route.ts (Next.js App Router)
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { leadId } = await req.json();
  // Fetch the lead data from DB by ID
  // (Assume we have a function getLeadById that returns {property_type, damage_type})
  const lead = await getLeadById(leadId);
  if (!lead) {
    return new Response(JSON.stringify({ error: "Lead not found" }), { status: 404 });
  }
  const { property_type, damage_type } = lead;
  const prompt = `You are an assistant helping summarize a disaster claim. The user is a ${property_type} who has experienced ${damage_type}. Provide a brief helpful summary of their situation.`;
  
  const { text: summary } = await generateText({
    model: openai('gpt-4'),  // or 'gpt-3.5-turbo' depending on cost/speed
    prompt,
    // You can include a system message for context if desired:
    system: "You are a helpful assistant providing a summary for an insurance claim.",
  });
  
  return new Response(JSON.stringify({ summary }), { status: 200 });
}