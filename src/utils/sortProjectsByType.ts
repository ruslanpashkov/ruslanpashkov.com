import { type Project, projectTypes } from '@/types/Project';

export function sortProjectsByType(projects: Project[]): Project[] {
	return [...projects].sort(
		(firstProject, secondProject) =>
			projectTypes.indexOf(firstProject.type) - projectTypes.indexOf(secondProject.type),
	);
}
