import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  // Hierarchical level configuration as JSON
  levelConfig: text('level_config', { mode: 'json' }).$defaultFn(() => ({
    level1: 'Chapter',
    level2: 'Section', 
    level3: 'Beat'
  })),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Flexible content nodes that can represent any hierarchical level
export const contentNodes = sqliteTable('content_nodes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').notNull().references(() => projects.id),
  parentId: text('parent_id').references(() => contentNodes.id), // null for top-level
  title: text('title').notNull(),
  level: integer('level').notNull(), // 1 = top level, 2 = second level, 3 = third level
  order: integer('order').notNull(), // order within the parent
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Keep chapters table for backward compatibility, but deprecate it
export const chapters = sqliteTable('chapters', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').notNull().references(() => projects.id),
  title: text('title').notNull(),
  order: integer('order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const revisions = sqliteTable('revisions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  // Update to reference contentNodes instead of chapters for new system
  nodeId: text('node_id').references(() => contentNodes.id),
  // Keep chapterId for backward compatibility
  chapterId: text('chapter_id').references(() => chapters.id),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(), // 'human', 'ai', or user id
  authorName: text('author_name').notNull(), // 'Dad', 'Daughter', 'Claude'
  parentRevisionId: text('parent_revision_id').references(() => revisions.id),
  aiMetadata: text('ai_metadata', { mode: 'json' }), // stores prompt used, model, etc as JSON
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});