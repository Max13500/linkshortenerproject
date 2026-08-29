import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 32 }).notNull().unique(),
  url: text('url').notNull(),
  userId: text('user_id').notNull(), // Clerk user id; users aren't stored locally
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
