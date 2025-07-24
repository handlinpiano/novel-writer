// Project and content type definitions
export interface LevelConfig {
  level1: string;
  level2: string;
  level3: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  levelConfig: LevelConfig;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ContentNode {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  level: number;
  order: number;
  headNotes: string | null;
  footNotes: string | null;
  children: ContentNode[];
  createdAt: Date;
}

export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  order: number;
  createdAt: Date;
}