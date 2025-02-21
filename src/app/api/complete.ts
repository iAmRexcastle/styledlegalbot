// pages/api/leads/complete.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, LeadsApi } from 'pipedrive';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const formData = req.body;
  const pipedriveApiKey = process.env.PIPEDRIVE_API_TOKEN;
  const configuration = new Configuration({ apiKey: pipedriveApiKey });
  const leadsApi = new LeadsApi(configuration);
  
  try {
    const lead = await leadsApi.addLead({
      title: "Website Form Lead",
      person_name: `${formData.firstName} ${formData.lastName}`,
      // include additional fields as needed
    });
    res.status(201).json({ lead });
  } catch (error) {
    res.status(500).json({ error: "Error submitting lead" });
  }
}