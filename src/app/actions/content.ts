'use server';

import { db } from '@/db';
import { contentNodes, projects, revisions } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { LevelConfig } from '@/lib/content-presets';

export async function updateProjectLevelConfig(projectId: string, levelConfig: LevelConfig) {
  await db
    .update(projects)
    .set({ 
      levelConfig: levelConfig as any,
      updatedAt: new Date()
    })
    .where(eq(projects.id, projectId));
    
  revalidatePath('/write');
}

export async function getContentTree(projectId: string) {
  const nodes = await db
    .select()
    .from(contentNodes)
    .where(eq(contentNodes.projectId, projectId))
    .orderBy(contentNodes.level, contentNodes.order);
    
  // Build hierarchical tree structure
  const nodeMap = new Map();
  const roots: any[] = [];
  
  // First pass: create all nodes
  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });
  
  // Second pass: build tree
  nodes.forEach(node => {
    const nodeWithChildren = nodeMap.get(node.id);
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(nodeWithChildren);
      }
    } else {
      roots.push(nodeWithChildren);
    }
  });
  
  return roots;
}

export async function createContentNode(
  projectId: string, 
  title: string, 
  level: number, 
  parentId?: string
) {
  // Get the order for this node (count siblings)
  const siblings = await db
    .select()
    .from(contentNodes)
    .where(
      and(
        eq(contentNodes.projectId, projectId),
        eq(contentNodes.level, level),
        parentId ? eq(contentNodes.parentId, parentId) : isNull(contentNodes.parentId)
      )
    );
    
  const result = await db.insert(contentNodes).values({
    projectId,
    parentId: parentId || null,
    title,
    level,
    order: siblings.length,
  }).returning();
  
  const node = Array.isArray(result) ? result[0] : result;
  // Create initial empty revision for level 3 nodes (leaf nodes)
  if (level === 3) {
    await db.insert(revisions).values({
      nodeId: node.id,
      content: '',
      authorId: 'user',
      authorName: 'User',
    });
  }
  
  revalidatePath('/write');
  return node;
}

export async function updateContentNode(nodeId: string, title: string) {
  await db
    .update(contentNodes)
    .set({ title })
    .where(eq(contentNodes.id, nodeId));
    
  revalidatePath('/write');
}

export async function deleteContentNode(nodeId: string) {
  // First delete all revisions for this node and its descendants
  const deleteRevisions = async (id: string) => {
    await db.delete(revisions).where(eq(revisions.nodeId, id));
    
    // Get children and recursively delete their revisions
    const children = await db
      .select()
      .from(contentNodes)
      .where(eq(contentNodes.parentId, id));
      
    for (const child of children) {
      await deleteRevisions(child.id);
    }
  };
  
  await deleteRevisions(nodeId);
  
  // Delete all descendant nodes
  const deleteNodes = async (id: string) => {
    const children = await db
      .select()
      .from(contentNodes)
      .where(eq(contentNodes.parentId, id));
      
    for (const child of children) {
      await deleteNodes(child.id);
    }
    
    await db.delete(contentNodes).where(eq(contentNodes.id, id));
  };
  
  await deleteNodes(nodeId);
  revalidatePath('/write');
}

export async function getNodeRevisions(nodeId: string) {
  return await db
    .select()
    .from(revisions)
    .where(eq(revisions.nodeId, nodeId))
    .orderBy(revisions.createdAt);
}

export async function saveNodeRevision(nodeId: string, content: string, authorName: string) {
  const result = await db.insert(revisions).values({
    nodeId,
    content,
    authorId: 'user',
    authorName,
  }).returning();
  
  const revision = Array.isArray(result) ? result[0] : result;
  revalidatePath('/write');
  return revision;
}

export async function updateNodeNotes(nodeId: string, headNotes?: string, footNotes?: string) {
  const updateData: any = {};
  if (headNotes !== undefined) updateData.headNotes = headNotes;
  if (footNotes !== undefined) updateData.footNotes = footNotes;
  
  await db
    .update(contentNodes)
    .set(updateData)
    .where(eq(contentNodes.id, nodeId));
    
  revalidatePath('/write');
}