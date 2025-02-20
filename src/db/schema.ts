import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title'),
  content: text('content'),
  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).defaultNow(),
});
