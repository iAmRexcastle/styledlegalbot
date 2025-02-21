// src/pages/api/generateSummary.ts
import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai"; // Import default export OpenAI

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { firstName, ownerType, propertyDamage, injuredStatus } = req.body;

  // Construct your prompt as needed. For example:
  const prompt = `Hey ${firstName}, congratulations on taking the first step toward understanding your fire claim! You've chosen to proceed as a ${ownerType} with ${propertyDamage} damage${
    injuredStatus === "injured" ? " and injuries" : ""
  }. Please provide further details so we can generate a precise claim estimate.`;

  // Instantiate the OpenAI client with your API key.
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    // Use the new chat completion method (verify with the latest docs)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const summaryText = response.choices[0]?.message?.content;
    res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Error generating summary" });
  }
}