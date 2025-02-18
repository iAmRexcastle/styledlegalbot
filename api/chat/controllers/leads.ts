// api/chat/controllers/leads.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Adjust the path/alias as needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const leadRecord = await prisma.trackingEvent.create({
      data: {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        utm_campaign: req.body.utm_campaign,
        utm_source: req.body.utm_source,
        utm_medium: req.body.utm_medium,
        campaign_id: req.body.campaignId,
        adset_id: req.body.adsetId,
        creative_id: req.body.creativeId,
        ttclid: req.body.ttclid,
      },
    });

    return res.status(201).json({ success: true, data: leadRecord });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}