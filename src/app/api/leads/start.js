// pages/api/lead/start.js (for Pages Router) or app/api/lead/start/route.ts (for App Router)
import { Pool } from 'pg';  // or use Neon driver
import { v4 as uuidv4 } from 'uuid';  // if generating UUID in app

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  const { propertyType, damageType } = JSON.parse(req.body);
  const leadId = uuidv4();
  try {
    await pool.query(
      'INSERT INTO leads(id, property_type, damage_type, is_complete) VALUES($1,$2,$3,$4)',
      [leadId, propertyType, damageType, false]
    );
    res.status(200).json({ leadId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save lead' });
  }
}