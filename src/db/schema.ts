import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
export const contentNodes: any = sqliteTable('content_nodes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').notNull().references(() => projects.id),
  parentId: text('parent_id'), // null for top-level, self-reference
  title: text('title').notNull(),
  level: integer('level').notNull(), // 1 = top level, 2 = second level, 3 = third level
  order: integer('order').notNull(), // order within the parent
  headNotes: text('head_notes'), // Pre-section notes
  footNotes: text('foot_notes'), // Post-section notes
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

// Characters in the story
export const characters = sqliteTable('characters', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').notNull().references(() => projects.id),
  name: text('name').notNull(),
  description: text('description'),
  notes: text('notes'), // Character development notes, backstory, etc.
  
  // Story Role & Archetype
  role: text('role').$defaultFn(() => 'supporting'), // 'protagonist', 'main', 'supporting', 'sidekick', 'antagonist', 'mentor'
  archetype: text('archetype'), // 'hero', 'mentor', 'trickster', 'sage', 'innocent', 'explorer', 'rebel', 'lover', 'creator', 'caregiver', 'magician', 'ruler'
  
  // Appearance (JSON object)
  appearance: text('appearance', { mode: 'json' }).$defaultFn(() => ({
    age: 25,
    height: 'average',
    build: 'average',
    hairColor: 'brown',
    eyeColor: 'brown',
    distinctiveFeatures: []
  })),
  
  // Personality Traits (0-100 sliders)
  personality: text('personality', { mode: 'json' }).$defaultFn(() => ({
    courage: 50,
    intelligence: 50,
    charisma: 50,
    kindness: 50,
    humor: 50,
    determination: 50
  })),
  
  // Story Impact & Relationships
  importanceLevel: integer('importance_level').$defaultFn(() => 3), // 1-5 scale
  relationships: text('relationships', { mode: 'json' }).$defaultFn(() => ({})), // { characterId: 'relationship_type' }
  
  // Motivations & Goals
  motivation: text('motivation'), // What drives this character
  goals: text('goals'), // What they want to achieve
  fears: text('fears'), // What they're afraid of
  secrets: text('secrets'), // Hidden aspects
  
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const revisions: any = sqliteTable('revisions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  // Update to reference contentNodes instead of chapters for new system
  nodeId: text('node_id'),
  // Keep chapterId for backward compatibility
  chapterId: text('chapter_id'),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(), // 'human', 'ai', or user id
  authorName: text('author_name').notNull(), // 'Dad', 'Daughter', 'Claude'
  parentRevisionId: text('parent_revision_id'), // self-reference
  aiMetadata: text('ai_metadata', { mode: 'json' }), // stores prompt used, model, etc as JSON
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});