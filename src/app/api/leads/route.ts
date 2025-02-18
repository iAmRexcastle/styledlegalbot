// src/app/api/leads/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";

interface LeadData {
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

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const body = (await request.json()) as LeadData;
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
    } = body;

    // Determine if the lead details are complete (for CRM submission)
    const isComplete = Boolean(firstName && lastName && phone && email);

    // Create an intermediary tracking record in your database
    const trackingData = await prisma.trackingEvent.create({
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

    // If we have full lead details, forward the data to Pipedrive
    if (isComplete) {
      const pipedriveUrl = "https://mtimid.com/panel/api/v1/lead";
      const pipedriveHeaders = {
        "Content-Type": "application/json",
        "x-auth-token": "9isnu8117638x972ol9i", // Replace with your actual token
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
        dryrun: "yes", // Adjust or remove as needed
      };

      await axios.post(pipedriveUrl, pipedriveData, { headers: pipedriveHeaders });

      // Optionally update the record to mark that it has been forwarded to Pipedrive
      await prisma.trackingEvent.update({
        where: { id: trackingData.id },
        data: { sentToPipedrive: true },
      });
    }

    return NextResponse.json(
      { success: true, data: trackingData },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}