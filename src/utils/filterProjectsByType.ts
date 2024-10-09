import type { Project, ProjectType } from '@/types/Project';

export function filterProjectsByType(projects: Project[], type: ProjectType): Project[] {
	return projects.filter((project) => project.type === type);
}
