// src/app/api/leads/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Define a Zod schema for incoming lead data.
// Personal fields are optional since the user may fill them later.
const LeadSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  // Tracking parameters and tokens (UTM, campaign info, etc.)
  utm_campaign: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  campaign_id: z.string().optional(),
  adset_id: z.string().optional(),
  creative_id: z.string().optional(),
  ttclid: z.string().optional(),
});

// Helper function to fire a tracking pixel (by sending a simple GET request).
async function fireTrackingPixel(url: string): Promise<void> {
  try {
    await fetch(url);
  } catch (error) {
    console.error('Error firing tracking pixel:', error);
  }
}

// POST handler for processing the lead data.
export async function POST(request: Request) {
  try {
    // Parse and validate the incoming JSON payload.
    const jsonData = await request.json();
    const leadData = LeadSchema.parse(jsonData);

    // FIRE INITIAL PIXEL:
    // Immediately fire a pixel when the lead is received.
    if (process.env.INITIAL_PIXEL_URL) {
      fireTrackingPixel(process.env.INITIAL_PIXEL_URL);
    }

    // STORE LEAD DATA:
    // Save the lead in your database.
    // IMPORTANT: Use `prisma.leads` if your model is named "Leads" in your Prisma schema.
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

    // OPTIONAL ANALYTICS EVENT:
    // If your Prisma client exposes a relation (e.g. a "leadEvent" model),
    // record an engagement event. (Adjust or remove this section if not applicable.)
    if ((prisma as any).leadEvent) {
      await (prisma as any).leadEvent.create({
        data: {
          type: 'ENGAGEMENT',
          detail: 'User engaged with chatbot',
          leadId: leadRecord.id,
        },
      });
    }

    // FIRE SUBMISSION PIXEL:
    // Fire a pixel after storing the lead.
    if (process.env.SUBMISSION_PIXEL_URL) {
      fireTrackingPixel(process.env.SUBMISSION_PIXEL_URL);
    }

    // FORWARD DATA TO PIPEDRIVE:
    // Send the lead data to your Pipedrive webhook.
    if (process.env.PIPEDRIVE_WEBHOOK_URL) {
      const pipedriveResponse = await fetch(process.env.PIPEDRIVE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      if (!pipedriveResponse.ok) {
        throw new Error('Failed to send data to Pipedrive');
      }
    }

    // FIRE LOGIN/FINAL PIXEL:
    // Fire another pixel when the user eventually logs in or creates an account.
    if (process.env.LOGIN_PIXEL_URL) {
      fireTrackingPixel(process.env.LOGIN_PIXEL_URL);
    }

    // Return a JSON response indicating success.
    return NextResponse.json({ success: true, leadId: leadRecord.id });
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}