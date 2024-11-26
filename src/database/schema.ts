import {pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {InferModel} from "drizzle-orm";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 })
    .notNull()
    .default('NEW'),
  priority: varchar('priority', { length: 50 })
    .notNull()
    .default('MEDIUM'),
  assignedToId: serial('assigned_to_id').references(() => users.id),
  createdById: serial('created_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
export type SelectTicket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

export const ticketComments = pgTable('ticket_comments', {
  id: serial('id').primaryKey(),
  ticketId: serial('ticket_id').references(() => tickets.id),
  userId: serial('user_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});