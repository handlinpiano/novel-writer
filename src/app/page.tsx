import { getProjects } from '@/app/actions/chapters';
import ProjectDashboard from '@/components/ProjectDashboard';

export default async function Home() {
  const projects = await getProjects();
  
  return <ProjectDashboard projects={projects} />;
}
