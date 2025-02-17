import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load environment variables from .env
config();

// Create the Neon client using your DATABASE_URL
const sql = neon(process.env.DATABASE_URL!);

// Initialize the Drizzle ORM client
export const db = drizzle({ client: sql });
