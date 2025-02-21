// src/app/api/leads/complete/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the incoming form data.
    const formData = await request.json();

    // Build the payload using lower_snake_case as required.
    const payload = {
      offer: "eaton_fire", // fixed offer per spec
      email: formData.email,
      // Remove non-digit characters; here we assume the webhook expects a 10-digit number.
      phone: formData.phone.replace(/\D/g, "").substring(0, 10),
      first_name: formData.firstName,
      last_name: formData.lastName,
      // Use the AI summary if provided as description.
      description: formData.summary || "",
      dryrun: "yes", // Optional: for testing purposes
      // Qualifier fields as arrays.
      injured: [formData.injuredStatus],
      property_damage: [formData.propertyDamage],
    };

    // Retrieve the webhook URL and auth token from environment variables.
    const webhookUrl = process.env.PIPEDRIVE_API_URL;
    const xAuthToken = process.env.PIPEDRIVE_X_AUTH_TOKEN;

    if (!webhookUrl || !xAuthToken) {
      throw new Error("Missing environment variables: PIPEDRIVE_API_URL or PIPEDRIVE_X_AUTH_TOKEN");
    }

    // Forward the payload to the Pipedrive webhook.
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": xAuthToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Webhook error response:", errorText);
      return NextResponse.json(
        { error: "Webhook response not OK", details: errorText },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error submitting lead via webhook:", error);
    return NextResponse.json({ error: "Error submitting lead via webhook" }, { status: 500 });
  }
}