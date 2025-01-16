import type { Article } from '@/types/Article';
import type { Link } from '@/types/Link';
import type { Project } from '@/types/Project';

import { generateTitle } from './generateTitle';
import {
	getArticleSchema,
	getBlogSchema,
	getBreadcrumbsSchema,
	getPersonSchema,
	getProjectsSchema,
} from './schemas';

export class SEOManager {
	static buildArticleSchema(website: URL, article: Article) {
		return getArticleSchema(website, article);
	}

	static buildBlogSchema(website: URL, articles: Article[]) {
		return getBlogSchema(website, articles);
	}

	static buildBreadcrumbsSchema(website: URL, breadcrumbs: Link[]) {
		return getBreadcrumbsSchema(website, breadcrumbs);
	}

	static buildPersonSchema(website: URL) {
		return getPersonSchema(website);
	}

	static buildProjectsSchema(website: URL, projects: Project[]) {
		return getProjectsSchema(website, projects);
	}

	static generatePageTitle(title: string) {
		return generateTitle(title);
	}
}
