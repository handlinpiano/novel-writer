'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { isNull } from 'drizzle-orm';

export async function migrateProjectsWithLevelConfig() {
  // Update all projects that don't have levelConfig set
  await db
    .update(projects)
    .set({
      levelConfig: {
        level1: 'Chapter',
        level2: 'Section', 
        level3: 'Beat'
      } as any,
    })
    .where(isNull(projects.levelConfig));
}