'use server';

import { db } from '@/db';
import { characters } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getCharacters(projectId: string) {
  return await db
    .select()
    .from(characters)
    .where(eq(characters.projectId, projectId))
    .orderBy(characters.name);
}

export async function createCharacter(projectId: string, characterData: any) {
  const [character] = await db.insert(characters).values({
    projectId,
    name: characterData.name,
    description: characterData.description || null,
    notes: characterData.notes || null,
    role: characterData.role || 'supporting',
    archetype: characterData.archetype || null,
    appearance: characterData.appearance || null,
    personality: characterData.personality || null,
    importanceLevel: characterData.importanceLevel || 3,
    relationships: characterData.relationships || {},
    motivation: characterData.motivation || null,
    goals: characterData.goals || null,
    fears: characterData.fears || null,
    secrets: characterData.secrets || null,
  }).returning();
  
  revalidatePath('/write');
  return character;
}

export async function updateCharacter(characterId: string, characterData: any) {
  const updateData: any = {
    updatedAt: new Date(),
    name: characterData.name,
    description: characterData.description || null,
    notes: characterData.notes || null,
    role: characterData.role || 'supporting',
    archetype: characterData.archetype || null,
    appearance: characterData.appearance || null,
    personality: characterData.personality || null,
    importanceLevel: characterData.importanceLevel || 3,
    relationships: characterData.relationships || {},
    motivation: characterData.motivation || null,
    goals: characterData.goals || null,
    fears: characterData.fears || null,
    secrets: characterData.secrets || null,
  };

  await db
    .update(characters)
    .set(updateData)
    .where(eq(characters.id, characterId));
    
  revalidatePath('/write');
}

export async function deleteCharacter(characterId: string) {
  await db.delete(characters).where(eq(characters.id, characterId));
  revalidatePath('/write');
}

export async function getCharacter(characterId: string) {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))
    .limit(1);
    
  return character || null;
}