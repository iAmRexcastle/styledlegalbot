// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.json();
    console.log('Partial lead data:', data);
    // Optionally: store partial tracking info to your DB
    return NextResponse.json({ success: true, partialLead: data });
  } catch (error) {
    console.error('Error in POST /api/leads', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.json();
    console.log('Final lead data:', data);

    // Store final lead in your database using Prisma
    const lead = await prisma.lead.create({
      data: { ...data },
    });

    // Optionally, trigger external API calls and pixel conversions here.

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Error in PATCH /api/leads', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}