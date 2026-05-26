import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const buildings = pgTable('buildings', {
  id:          serial('id').primaryKey(),
  uid:         varchar('uid', { length: 32 }).notNull().unique(),
  name:        text('name').notNull(),
  pin:         varchar('pin', { length: 6 }).notNull(),
  description: text('description').notNull(),
  imageUrl:    text('image_url'),
  pdfUrl:      text('pdf_url'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

export type Building    = typeof buildings.$inferSelect;
export type NewBuilding = typeof buildings.$inferInsert;
