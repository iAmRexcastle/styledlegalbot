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
    // @ts-ignore: Temporarily disable type-checking for this create call
    const leadRecord = await prisma.trackingEvent.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        utmCampaign: req.body.utm_campaign,
        utmSource: req.body.utm_source,
        utmMedium: req.body.utm_medium,
        campaignId: req.body.campaignId,
        adsetId: req.body.adsetId,
        creativeId: req.body.creativeId,
        ttclid: req.body.ttclid,
      },
    });

    return res.status(201).json({ success: true, data: leadRecord });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}