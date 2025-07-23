import { getProjects, createProject } from '@/app/actions/chapters';
import { getContentTree } from '@/app/actions/content';
import { getCharacters } from '@/app/actions/characters';
import { migrateProjectsWithLevelConfig } from '@/app/actions/migrate';
import WritePageClient from './WritePageClient';

export default async function WritePage() {
  // Migrate existing projects to have levelConfig
  await migrateProjectsWithLevelConfig();
  
  // Get or create default project
  let projects = await getProjects();
  
  if (projects.length === 0) {
    const newProject = await createProject('My Novel', 'A collaborative story by Dad and Daughter');
    projects = [newProject];
  }
  
  const currentProject = projects[0];
  const contentTree = await getContentTree(currentProject.id);
  const characters = await getCharacters(currentProject.id);
  
  return (
    <WritePageClient 
      initialProjects={projects}
      initialProject={currentProject}
      initialContentTree={contentTree}
      initialCharacters={characters}
    />
  );
}