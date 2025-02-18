// src/app/api/leads/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Define the schema for the incoming lead data. Adjust or add fields as needed.
const LeadSchema = z.object({
  first_name: z.string().optional(),  // may be submitted later
  last_name: z.string().optional(),   // may be submitted later
  phone: z.string().optional(),       // may be submitted later
  email: z.string().email().optional(), // may be submitted later
  // Tracking parameters (UTM tokens, campaign info, etc.)
  utm_campaign: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  campaign_id: z.string().optional(),
  adset_id: z.string().optional(),
  creative_id: z.string().optional(),
  ttclid: z.string().optional(),
  // You can add additional tokens or tracking fields as needed
});

// Helper function to fire a tracking pixel by making a GET request.
async function fireTrackingPixel(url: string) {
  try {
    await fetch(url);
  } catch (error) {
    console.error('Error firing tracking pixel:', error);
  }
}

// The POST handler receives the lead data, validates it, stores it,
// fires the appropriate tracking pixels, and forwards the data to Pipedrive.
export async function POST(request: Request) {
  try {
    // Parse and validate the incoming JSON data.
    const jsonData = await request.json();
    const leadData = LeadSchema.parse(jsonData);

    // FIRE INITIAL PIXEL: Triggered when the user first interacts.
    const initialPixelUrl = process.env.INITIAL_PIXEL_URL;
    if (initialPixelUrl) {
      fireTrackingPixel(initialPixelUrl);
    }

    // STORE LEAD DATA: Save the data in your database using Prisma.
    // (Ensure your Prisma schema defines a model 'Lead' with matching fields.)
    const leadRecord = await prisma.lead.create({
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
        // Add more fields here if needed
      },
    });

    // FIRE SUBMISSION PIXEL: Triggered immediately after form submission.
    const submissionPixelUrl = process.env.SUBMISSION_PIXEL_URL;
    if (submissionPixelUrl) {
      fireTrackingPixel(submissionPixelUrl);
    }

    // POST TO PIPEDRIVE: Send the lead data to your Pipedrive webhook.
    const pipedriveResponse = await fetch(process.env.PIPEDRIVE_WEBHOOK_URL || '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (!pipedriveResponse.ok) {
      throw new Error('Failed to send data to Pipedrive');
    }

    // FIRE LOGIN/FINAL PIXEL: Triggered when the user creates an account or logs in.
    // (If this step is part of the same endpoint, otherwise trigger separately.)
    const loginPixelUrl = process.env.LOGIN_PIXEL_URL;
    if (loginPixelUrl) {
      fireTrackingPixel(loginPixelUrl);
    }

    // Respond with a success message.
    return NextResponse.json({ success: true, leadId: leadRecord.id });
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}