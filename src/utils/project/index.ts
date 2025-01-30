import {
	type CategorizedProjects,
	type Project,
	type ProjectType,
	projectTypes,
} from '@/types/Project';

export const sortByType = (projects: Project[]): Project[] =>
	projects.toSorted(
		(first, second) => projectTypes.indexOf(first.type) - projectTypes.indexOf(second.type),
	);

export const filterByType = (projects: Project[], type: ProjectType): Project[] =>
	projects.filter((project) => project.type === type);

export const categorize = (
	projects: Project[],
	types: readonly ProjectType[] = projectTypes,
): CategorizedProjects =>
	types.reduce((categorized, type) => {
		categorized[type] = filterByType(projects, type);

		return categorized;
	}, {} as CategorizedProjects);
