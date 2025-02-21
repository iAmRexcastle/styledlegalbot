// src/app/api/leads/complete/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db"; // adjust the path as needed
import { claims } from "@/schema"; // your schema file
import fetch from "node-fetch";

// Define the schema for the complete lead payload.
const LeadCompleteSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is too short").regex(/^\d+$/, "Phone must be numeric"),
  ownerType: z.string().min(1),
  propertyDamage: z.string().min(1),
  injuredStatus: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // Parse and validate incoming data.
    const body = await req.json();
    const data = await LeadCompleteSchema.parseAsync(body);

    // Update the lead in the database (this is an example using Drizzle).
    // You might need to identify the lead by an ID if updating an existing record.
    await db.update(claims)
      .set({ 
        firstName: data.firstName, 
        lastName: data.lastName, 
        email: data.email, 
        phone: data.phone, 
        // Optionally, store a generated summary or mark the lead as complete.
      })
      .where(/* your condition to match the lead, e.g., id equals something */);

    // Prepare payload for the external webhook (Pipedrive API).
    const payload = {
      offer: "eaton_fire",
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      description: `Owner: ${data.ownerType}, Damage: ${data.propertyDamage}, Injury: ${data.injuredStatus}`,
      injured: data.injuredStatus, // assuming single value
      property_damage: data.propertyDamage, // assuming single value
    };

    // Send POST request to the external webhook.
    const externalRes = await fetch("https://mtimid.com/panel/api/v1/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": "9isnu8117638x972ol9i",
      },
      body: JSON.stringify(payload),
    });

    const result = await externalRes.json();
    if (!externalRes.ok) {
      return NextResponse.json({ error: result.message || "External API error" }, { status: externalRes.status });
    }

    return NextResponse.json({ message: "Lead submitted successfully", data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}