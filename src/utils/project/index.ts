import {
	type CategorizedProjects,
	type Project,
	type ProjectType,
	projectTypes,
} from '@/types/Project';

export class ProjectManager {
	static categorize(
		projects: Project[],
		types: readonly ProjectType[] = projectTypes,
	): CategorizedProjects {
		return types.reduce((categorized, type) => {
			categorized[type] = this.filterByType(projects, type);

			return categorized;
		}, {} as CategorizedProjects);
	}

	static filterByType(projects: Project[], type: ProjectType): Project[] {
		return projects.filter((project) => project.type === type);
	}

	static sortByType(projects: Project[]): Project[] {
		return projects.toSorted(
			(first, second) => projectTypes.indexOf(first.type) - projectTypes.indexOf(second.type),
		);
	}
}
