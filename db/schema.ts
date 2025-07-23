import { pgTable, text, timestamp, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chapters = pgTable('chapters', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  title: text('title').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const revisions = pgTable('revisions', {
  id: uuid('id').defaultRandom().primaryKey(),
  chapterId: uuid('chapter_id').references(() => chapters.id).notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(), // 'human', 'ai', or user id
  authorName: text('author_name').notNull(), // 'Dad', 'Daughter', 'Claude'
  parentRevisionId: uuid('parent_revision_id').references(() => revisions.id),
  aiMetadata: jsonb('ai_metadata'), // stores prompt used, model, etc
  createdAt: timestamp('created_at').defaultNow().notNull(),
});