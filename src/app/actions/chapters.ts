'use server';

import { db } from '@/db';
import { chapters, projects, revisions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createProject(title: string, description?: string) {
  const result = await db.insert(projects).values({
    title,
    description: description || '',
    levelConfig: {
      level1: 'Chapter',
      level2: 'Section', 
      level3: 'Beat'
    },
  }).returning();
  
  const project = Array.isArray(result) ? result[0] : result;
  // Create first chapter automatically
  await createChapter(project.id, 'Chapter 1');
  
  return project;
}

export async function updateProject(projectId: string, title: string, description?: string) {
  await db
    .update(projects)
    .set({ 
      title, 
      description: description || '',
      updatedAt: new Date()
    })
    .where(eq(projects.id, projectId));
    
  revalidatePath('/write');
}

export async function deleteProject(projectId: string) {
  // First delete all revisions for chapters in this project
  const projectChapters = await db
    .select()
    .from(chapters)
    .where(eq(chapters.projectId, projectId));
    
  for (const chapter of projectChapters) {
    await db.delete(revisions).where(eq(revisions.chapterId, chapter.id));
  }
  
  // Then delete all chapters
  await db.delete(chapters).where(eq(chapters.projectId, projectId));
  
  // Finally delete the project
  await db.delete(projects).where(eq(projects.id, projectId));
  
  revalidatePath('/write');
}

export async function getProjects() {
  return await db.select().from(projects);
}

export async function createChapter(projectId: string, title: string) {
  const existingChapters = await db
    .select()
    .from(chapters)
    .where(eq(chapters.projectId, projectId));
    
  const result = await db.insert(chapters).values({
    projectId,
    title,
    order: existingChapters.length,
  }).returning();
  
  const chapter = Array.isArray(result) ? result[0] : result;
  // Create initial empty revision
  await db.insert(revisions).values({
    chapterId: chapter.id,
    content: '',
    authorId: 'user',
    authorName: 'User',
  });
  
  revalidatePath('/write');
  return chapter;
}

export async function getChapters(projectId: string) {
  return await db
    .select()
    .from(chapters)
    .where(eq(chapters.projectId, projectId))
    .orderBy(chapters.order);
}

export async function updateChapterTitle(chapterId: string, title: string) {
  await db
    .update(chapters)
    .set({ title })
    .where(eq(chapters.id, chapterId));
    
  revalidatePath('/write');
}

export async function deleteChapter(chapterId: string) {
  await db.delete(chapters).where(eq(chapters.id, chapterId));
  revalidatePath('/write');
}

export async function getLatestRevision(chapterId: string) {
  const [revision] = await db
    .select()
    .from(revisions)
    .where(eq(revisions.chapterId, chapterId))
    .orderBy(revisions.createdAt)
    .limit(1);
    
  return revision;
}

export async function saveRevision(chapterId: string, content: string, authorName: string) {
  const result = await db.insert(revisions).values({
    chapterId,
    content,
    authorId: 'user',
    authorName,
  }).returning();
  
  const revision = Array.isArray(result) ? result[0] : result;
  revalidatePath('/write');
  return revision;
}