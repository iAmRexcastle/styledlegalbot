// src/app/api/leads/route.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import axios from "axios";

// Define the shape of our incoming tracking data.
interface LeadRequestBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  campaignId?: string;
  adsetId?: string;
  creativeId?: string;
  ttclid?: string;
}

// This handler accepts POST requests.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  // Parse the incoming JSON body.
  const {
    firstName,
    lastName,
    phone,
    email,
    utm_campaign,
    utm_source,
    utm_medium,
    campaignId,
    adsetId,
    creativeId,
    ttclid,
  } = req.body as LeadRequestBody;

  // Determine if we have the complete lead information.
  const isComplete =
    Boolean(firstName && lastName && phone && email);

  try {
    // Create an intermediary tracking record.
    const trackingRecord = await prisma.trackingEvent.create({
      data: {
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        email: email || null,
        utm_campaign: utm_campaign || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        campaign_id: campaignId || null,
        adset_id: adsetId || null,
        creative_id: creativeId || null,
        ttclid: ttclid || null,
        isCompleted: isComplete,
      },
    });

    // If the lead data is not complete, return a partial success message.
    if (!isComplete) {
      return res.status(201).json({
        success: true,
        data: trackingRecord,
        message:
          "Partial tracking data recorded. Awaiting complete lead details.",
      });
    }

    // If complete, prepare data for Pipedrive.
    const pipedriveUrl = "https://mtimid.com/panel/api/v1/lead";
    const pipedriveHeaders = {
      "Content-Type": "application/json",
      "x-auth-token": "9isnu8117638x972ol9i", // Use your actual token
    };

    const pipedriveData = {
      offer: "eaton_fire",
      email,
      phone,
      first_name: firstName,
      last_name: lastName,
      description:
        "Lead submitted with tracking data: " +
        JSON.stringify({
          utm_campaign,
          utm_source,
          utm_medium,
          campaignId,
          adsetId,
          creativeId,
          ttclid,
        }),
      dryrun: "yes", // Adjust or remove this flag as needed.
      // Include any qualifier fields if required by the API.
    };

    // Forward the complete lead data to Pipedrive.
    await axios.post(pipedriveUrl, pipedriveData, { headers: pipedriveHeaders });

    // Update the tracking record to indicate it has been sent.
    await prisma.trackingEvent.update({
      where: { id: trackingRecord.id },
      data: { sentToPipedrive: true },
    });

    return res
      .status(201)
      .json({ success: true, data: trackingRecord, message: "Lead data fully processed and sent to Pipedrive." });
  } catch (error: any) {
    console.error("Error processing lead tracking:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}