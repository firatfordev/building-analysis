import { pgTable, serial, text, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

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

export const contactMessages = pgTable('contact_messages', {
  id:        serial('id').primaryKey(),
  name:      text('name').notNull(),
  email:     varchar('email', { length: 255 }).notNull(),
  phone:     varchar('phone', { length: 100 }),
  subject:   varchar('subject', { length: 255 }),
  message:   text('message').notNull(),
  isRead:    boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const quotations = pgTable('quotations', {
  id:           serial('id').primaryKey(),
  // Contact
  fullName:     text('full_name').notNull(),
  email:        varchar('email', { length: 255 }).notNull(),
  phone:        varchar('phone', { length: 100 }),
  company:      text('company'),
  // Property
  propertyName: text('property_name').notNull(),
  propertyType: varchar('property_type', { length: 100 }).notNull(),
  propertySize: varchar('property_size', { length: 100 }).notNull(),
  floors:       varchar('floors', { length: 50 }).notNull(),
  buildingAge:  varchar('building_age', { length: 50 }).notNull(),
  addons:       text('addons'),          // JSON-encoded string[]
  notes:        text('notes'),
  // Pricing
  totalPrice:   integer('total_price').notNull(),
  // Admin
  status:       varchar('status', { length: 50 }).default('pending').notNull(),
  isRead:       boolean('is_read').default(false).notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
  key:       varchar('key', { length: 100 }).primaryKey(),
  value:     text('value'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Building          = typeof buildings.$inferSelect;
export type NewBuilding       = typeof buildings.$inferInsert;
export type ContactMessage    = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type Quotation         = typeof quotations.$inferSelect;
export type NewQuotation      = typeof quotations.$inferInsert;
export type Setting           = typeof settings.$inferSelect;
