// app/api/leads/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client (ensure single instance in development to avoid warnings)
const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Define Zod schema for expected request body structure
const LeadSchema = z.object({
  event: z.enum(['engagement', 'submission', 'account']),  // type of event
  name: z.string().min(1).optional(),   // lead's name (required for submission)
  email: z.string().email().optional(), // lead's email (required for submission)
  message: z.string().optional(),       // message or interaction content
  clickId: z.string().optional()        // tracking click ID for Voluum
})

// Pipedrive API settings (API token and company domain from env variables)
const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN
const PIPEDRIVE_COMPANY_DOMAIN = process.env.PIPEDRIVE_COMPANY_DOMAIN

// Voluum base tracking URL (could also come from env for flexibility)
const VOLUUM_BASE_URL = process.env.VOLUUM_TRACKING_URL  // e.g., 'https://www.gottotrack.com/postback'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = LeadSchema.safeParse(body)
    if (!result.success) {
      // If validation fails, return 400 with error details
      return NextResponse.json(
        { error: 'Invalid request data', issues: result.error.errors },
        { status: 400 }
      )
    }

    const data = result.data
    const { event, name, email, message, clickId } = data

    // 1. Log or store the engagement event (before form submission)
    if (event === 'engagement') {
      // Fire Voluum engagement pixel
      if (clickId) {
        const engagementUrl = `${VOLUUM_BASE_URL}?cid=${encodeURIComponent(clickId)}&et=engagement`
        fetch(engagementUrl).catch(err => {
          console.error('Voluum engagement pixel error:', err)
        })
      }

      // Optionally, store the engagement in DB for analytics (if needed)
      await prisma.leadEvent.create({
        data: {
          type: 'ENGAGEMENT',
          detail: message || 'User engaged with chatbot',
          // You might want to link this to a lead session or similar
        }
      })

      return NextResponse.json({ status: 'engagement recorded' }, { status: 200 })
    }

    // 2. Handle form submission (lead capture)
    if (event === 'submission') {
      // Ensure required fields for submission are present
      if (!name || !email) {
        return NextResponse.json(
          { error: 'Name and email are required for submission' },
          { status: 400 }
        )
      }

      // Store lead in the database via Prisma
      const newLead = await prisma.lead.create({
        data: {
          name,
          email,
          message // possibly store the last message or context
          // Other fields like timestamp are handled by Prisma if defined in schema
        }
      })

      // Send lead to Pipedrive (create Person and Lead)
      if (PIPEDRIVE_API_TOKEN && PIPEDRIVE_COMPANY_DOMAIN) {
        try {
          // First, create or find a Person in Pipedrive for this lead’s email
          const personResponse = await fetch(
            `https://${PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/v1/persons?api_token=${PIPEDRIVE_API_TOKEN}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email: [{ value: email, primary: true }] })
            }
          )
          const personData = await personResponse.json()
          let personId: number | undefined = personData?.data?.id

          if (!personId) {
            // If person creation failed or person exists, try searching by email
            const searchRes = await fetch(
              `https://${PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/v1/persons/search?term=${encodeURIComponent(email)}&fields=email&api_token=${PIPEDRIVE_API_TOKEN}`
            )
            const searchData = await searchRes.json()
            personId = searchData?.data?.items?.[0]?.item?.id
          }

          // Create a Lead linked to the person
          if (personId) {
            await fetch(
              `https://${PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/v1/leads?api_token=${PIPEDRIVE_API_TOKEN}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: `Chatbot Lead - ${name}`,
                  person_id: personId
                  // Add other lead details or custom fields if needed
                })
              }
            )
          }
        } catch (err) {
          console.error('Pipedrive API error:', err)
          // Note: We don't fail the whole request if Pipedrive integration fails
        }
      }

      // Fire Voluum lead (form submission) pixel
      if (clickId) {
        const leadUrl = `${VOLUUM_BASE_URL}?cid=${encodeURIComponent(clickId)}&et=lead`
        fetch(leadUrl).catch(err => {
          console.error('Voluum lead pixel error:', err)
        })
      }

      return NextResponse.json({ status: 'lead recorded', leadId: newLead.id }, { status: 201 })
    }

    // 3. Handle account creation event (if applicable)
    if (event === 'account') {
      // For an account creation, perhaps tie to an existing lead by email or ID
      if (email) {
        await prisma.lead.updateMany({
          where: { email },
          data: { accountCreated: true }  // assuming accountCreated is a field
        })
      }

      // Fire Voluum account creation pixel
      if (clickId) {
        const accountUrl = `${VOLUUM_BASE_URL}?cid=${encodeURIComponent(clickId)}&et=account`
        fetch(accountUrl).catch(err => {
          console.error('Voluum account pixel error:', err)
        })
      }

      return NextResponse.json({ status: 'account event recorded' }, { status: 200 })
    }

    // If event type is unrecognized, return bad request
    return NextResponse.json({ error: 'Unknown event type' }, { status: 400 })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// (Optional) Specify that we want to use the Node.js runtime (not Edge) on Vercel
export const runtime = 'nodejs'