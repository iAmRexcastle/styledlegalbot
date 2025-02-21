// src/schema.ts
import { pgTable, serial, text, boolean, varchar } from "drizzle-orm/pg-core";

export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  ownerType: varchar("ownerType", { length: 50 }),
  propertyDamage: varchar("propertyDamage", { length: 50 }),
  injuredStatus: varchar("injuredStatus", { length: 50 }),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  email: text("email"),
  phone: text("phone"),
  tcpaConsent: boolean("tcpaConsent"),
  summary: text("summary"), // Optional: store the generated summary
});