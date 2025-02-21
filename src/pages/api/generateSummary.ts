// pages/api/generateSummary.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { firstName, ownerType, propertyDamage, injuredStatus } = req.body;
  const prompt = `Hey ${firstName}, congratulations on taking the first step ...`; // build your full prompt here

  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const summaryText = response.data.choices[0]?.message?.content;
    res.status(200).json({ summary: summaryText });
  } catch (error) {
    res.status(500).json({ error: "Error generating summary" });
  }
}