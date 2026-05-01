import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Clients = sqliteTable('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const Posts = sqliteTable('posts', {
  id: text('id').primaryKey().unique(),
  title: text('title').notNull(),
  likes: integer('likes').default(0),
});
