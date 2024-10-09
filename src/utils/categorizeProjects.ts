import type { CategorizedProjects, Project, ProjectType } from '@/types/Project';

import { filterProjectsByType } from '@/utils/filterProjectsByType';

export function categorizeProjects(
	projects: Project[],
	projectTypes: readonly ProjectType[],
): CategorizedProjects {
	return projectTypes.reduce((categorizedProjects, type) => {
		categorizedProjects[type] = filterProjectsByType(projects, type);

		return categorizedProjects;
	}, {} as CategorizedProjects);
}
