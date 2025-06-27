import type { projectTypes } from '@/data/projects';
import type { Link } from '@/types/Link';

export type ProjectType = (typeof projectTypes)[number];

export interface Project extends Link {
	description: string;
	tags: string[];
	type: ProjectType;
}

export type CategorizedProjects = {
	[K in ProjectType]: Project[];
};
