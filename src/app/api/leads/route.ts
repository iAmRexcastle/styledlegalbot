// src/app/api/leads/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Define a Zod schema for incoming lead data.
// Note: Personal fields (first_name, last_name, phone, email) are optional
// because they might be filled later in the funnel.
const LeadSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  // Tracking parameters (UTMs, campaign info, tokens, etc.)
  utm_campaign: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  campaign_id: z.string().optional(),
  adset_id: z.string().optional(),
  creative_id: z.string().optional(),
  ttclid: z.string().optional(),
});

// Helper function to fire a tracking pixel (by performing a GET request).
async function fireTrackingPixel(url: string) {
  try {
    await fetch(url);
  } catch (error) {
    console.error('Error firing tracking pixel:', error);
  }
}

// POST handler for the API route.
export async function POST(request: Request) {
  try {
    // Parse and validate the JSON payload.
    const jsonData = await request.json();
    const leadData = LeadSchema.parse(jsonData);

    // FIRE INITIAL PIXEL: triggered immediately when the lead is received.
    const initialPixelUrl = process.env.INITIAL_PIXEL_URL;
    if (initialPixelUrl) {
      fireTrackingPixel(initialPixelUrl);
    }

    // STORE LEAD DATA: Save the lead in the database.
    // IMPORTANT: Adjust "prisma.leads" to match the name of your model in your Prisma schema.
    const leadRecord = await prisma.leads.create({
      data: {
        first_name: leadData.first_name,
        last_name: leadData.last_name,
        phone: leadData.phone,
        email: leadData.email,
        utm_campaign: leadData.utm_campaign,
        utm_source: leadData.utm_source,
        utm_medium: leadData.utm_medium,
        campaign_id: leadData.campaign_id,
        adset_id: leadData.adset_id,
        creative_id: leadData.creative_id,
        ttclid: leadData.ttclid,
      },
    });

    // OPTIONAL: Save an engagement event (if your schema/model exists).
    // This step records an analytic event tied to the lead.
    if ((prisma as any).leadEvent) {
      await (prisma as any).leadEvent.create({
        data: {
          type: 'ENGAGEMENT',
          detail: 'User engaged with chatbot',
          leadId: leadRecord.id,
        },
      });
    }

    // FIRE SUBMISSION PIXEL: triggered after storing the lead.
    const submissionPixelUrl = process.env.SUBMISSION_PIXEL_URL;
    if (submissionPixelUrl) {
      fireTrackingPixel(submissionPixelUrl);
    }

    // FORWARD DATA TO PIPEDRIVE: Send the lead data to your Pipedrive webhook.
    const pipedriveWebhookUrl = process.env.PIPEDRIVE_WEBHOOK_URL || '';
    const pipedriveResponse = await fetch(pipedriveWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (!pipedriveResponse.ok) {
      throw new Error('Failed to send data to Pipedrive');
    }

    // FIRE LOGIN/FINAL PIXEL: triggered when the user later logs in or creates an account.
    const loginPixelUrl = process.env.LOGIN_PIXEL_URL;
    if (loginPixelUrl) {
      fireTrackingPixel(loginPixelUrl);
    }

    // Return a successful JSON response.
    return NextResponse.json({ success: true, leadId: leadRecord.id });
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}