import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 50 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
export type User = typeof users.$inferSelect;

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('NEW'),
  priority: varchar('priority', { length: 50 }).notNull().default('MEDIUM'),
  assignedToId: serial('assigned_to_id').references(() => users.id),
  createdById: serial('created_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
export type Ticket = typeof tickets.$inferSelect;

export const ticketComments = pgTable('ticket_comments', {
  id: serial('id').primaryKey(),
  ticketId: serial('ticket_id').references(() => tickets.id),
  userId: serial('user_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
