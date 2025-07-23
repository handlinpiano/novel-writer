import { getProjects, getChapters, createProject } from '@/app/actions/chapters';
import WritePageClient from './WritePageClient';

export default async function WritePage() {
  // Get or create default project
  let projects = await getProjects();
  
  if (projects.length === 0) {
    const newProject = await createProject('My Novel', 'A collaborative story by Dad and Daughter');
    projects = [newProject];
  }
  
  const currentProject = projects[0];
  const chapters = await getChapters(currentProject.id);
  
  return (
    <WritePageClient 
      initialProjects={projects}
      initialProject={currentProject}
      initialChapters={chapters}
    />
  );
}