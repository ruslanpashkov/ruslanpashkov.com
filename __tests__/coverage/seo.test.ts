import type { CollectionEntry } from 'astro:content';

import { describe, expect, it } from 'vitest';

import type { Link } from '@/types/Link';
import type { Project } from '@/types/Project';

import { generateTitle } from '@/utils/seo';
import {
	getArticleSchema,
	getBlogSchema,
	getBreadcrumbsSchema,
	getPersonSchema,
	getProjectsSchema,
} from '@/utils/seo/schemas';

// The schema-dts library has complex union types that TypeScript can't properly narrow
// for testing purposes. Using a simple Record<string, any> type allows us to test
// the actual schema structure without dealing with the complex type system.
// TODO: Find a better way to test the schema structure.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchemaObject = Record<string, any>;

describe('SEO utilities', () => {
	const mockWebsite = new URL('https://example.com');

	describe('generateTitle', () => {
		it('should generate title with author name', () => {
			const title = 'Test Article';

			const result = generateTitle(title);

			expect(result).toBe('Test Article | Ruslan Pashkov');
		});

		it('should handle empty title', () => {
			const title = '';

			const result = generateTitle(title);

			expect(result).toBe(' | Ruslan Pashkov');
		});

		it('should handle title with special characters', () => {
			const title = 'Article with "quotes" & symbols!';

			const result = generateTitle(title);

			expect(result).toBe('Article with "quotes" & symbols! | Ruslan Pashkov');
		});

		it('should handle long title', () => {
			const title =
				'This is a very long article title that might be used for SEO purposes and should be handled properly';

			const result = generateTitle(title);

			expect(result).toBe(
				'This is a very long article title that might be used for SEO purposes and should be handled properly | Ruslan Pashkov',
			);
		});

		it('should handle title with numbers', () => {
			const title = 'Article 123: The Best of 2025';

			const result = generateTitle(title);

			expect(result).toBe('Article 123: The Best of 2025 | Ruslan Pashkov');
		});

		it('should handle title with emojis', () => {
			const title = '🚀 Amazing Article 🎉';

			const result = generateTitle(title);

			expect(result).toBe('🚀 Amazing Article 🎉 | Ruslan Pashkov');
		});
	});

	describe('getArticleSchema', () => {
		it('should generate valid article schema', () => {
			const mockArticle: CollectionEntry<'blog'> = {
				body: 'Test article content',
				collection: 'blog',
				data: {
					categories: ['Technology', 'Programming'],
					description: 'Test article description',
					publishedAt: '2025-01-01',
					slug: 'test-article',
					title: 'Test Article',
					topic: 'Web Development',
				},
				id: 'test-article',
			};

			const result = getArticleSchema(mockWebsite, mockArticle) as SchemaObject;

			expect(result['@context']).toBe('https://schema.org');
			expect(result['@type']).toBe('BlogPosting');
			expect(result['@id']).toBe('https://example.com/blog/test-article/');
			expect(result.headline).toBe('Test Article');
			expect(result.description).toBe('Test article description');
			expect(result.datePublished).toMatch(/^2025-01-01T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
			expect(result.keywords).toBe('Technology, Programming');
			expect(result.inLanguage).toBe('en');
			expect(result.url).toBe('https://example.com/blog/test-article/');
			expect(result.about['@type']).toBe('Thing');
			expect(result.about.name).toBe('Web Development');
			expect(result.author['@type']).toBe('Person');
			expect(result.publisher['@type']).toBe('Person');
			expect(result.image['@type']).toBe('ImageObject');
			expect(result.image.url).toBe('https://example.com/images/previews/test-article.png');
			expect(result.image.width).toBe('1200');
			expect(result.image.height).toBe('630');
		});

		it('should handle article with multiple categories', () => {
			const mockArticle: CollectionEntry<'blog'> = {
				body: 'Test content',
				collection: 'blog',
				data: {
					categories: ['Tech', 'AI', 'Machine Learning'],
					description: 'Test description',
					publishedAt: '2025-01-01',
					slug: 'ai-article',
					title: 'AI Article',
					topic: 'Artificial Intelligence',
				},
				id: 'ai-article',
			};

			const result = getArticleSchema(mockWebsite, mockArticle) as SchemaObject;

			expect(result.keywords).toBe('Tech, AI, Machine Learning');
			expect(result.articleSection).toEqual(['Tech', 'AI', 'Machine Learning']);
		});
	});

	describe('getBlogSchema', () => {
		it('should generate valid blog schema', () => {
			const mockArticles: CollectionEntry<'blog'>[] = [
				{
					body: 'Article 1 content',
					collection: 'blog',
					data: {
						categories: ['Tech'],
						description: 'Article 1 description',
						publishedAt: '2025-01-01',
						slug: 'article-1',
						title: 'Article 1',
						topic: 'Technology',
					},
					id: 'article-1',
				},
				{
					body: 'Article 2 content',
					collection: 'blog',
					data: {
						categories: ['Programming'],
						description: 'Article 2 description',
						publishedAt: '2025-01-02',
						slug: 'article-2',
						title: 'Article 2',
						topic: 'Programming',
					},
					id: 'article-2',
				},
			];

			const result = getBlogSchema(mockWebsite, mockArticles) as SchemaObject;

			expect(result['@context']).toBe('https://schema.org');
			expect(result['@type']).toBe('Blog');
			expect(result['@id']).toBe('https://example.com/');
			expect(result.name).toBe('Blog | Ruslan Pashkov');
			expect(result.author['@type']).toBe('Person');
			expect(result.publisher['@type']).toBe('Person');
			expect(result.blogPost).toHaveLength(2);
			expect(result.blogPost[0]['@type']).toBe('BlogPosting');
			expect(result.blogPost[1]['@type']).toBe('BlogPosting');
		});

		it('should handle empty articles array', () => {
			const result = getBlogSchema(mockWebsite, []) as SchemaObject;

			expect(result.blogPost).toHaveLength(0);
		});
	});

	describe('getPersonSchema', () => {
		it('should generate valid person schema', () => {
			const result = getPersonSchema(mockWebsite) as SchemaObject;

			expect(result['@context']).toBe('https://schema.org');
			expect(result['@type']).toBe('Person');
			expect(result['@id']).toBe('https://example.com/');
			expect(result.name).toBe('Ruslan Pashkov');
			expect(result.givenName).toBe('Ruslan');
			expect(result.familyName).toBe('Pashkov');
			expect(result.jobTitle).toBe('Lead Frontend Engineer');
			expect(result.alumniOf).toBe('Unknown');
			expect(result.gender).toBe('Male');
			expect(result.nationality['@type']).toBe('Country');
			expect(result.worksFor['@type']).toBe('Organization');
			expect(result.knowsLanguage).toBeInstanceOf(Array);
			expect(result.knowsAbout).toBeInstanceOf(Array);
		});

		it('should include language schemas', () => {
			const result = getPersonSchema(mockWebsite) as SchemaObject;

			expect(result.knowsLanguage).toHaveLength(3);
			expect(result.knowsLanguage[0]['@type']).toBe('Language');
			expect(result.knowsLanguage[0].name).toBe('English');
			expect(result.knowsLanguage[0].alternateName).toBe('en');
		});
	});

	describe('getProjectsSchema', () => {
		it('should generate valid projects schema', () => {
			const mockProjects: Project[] = [
				{
					description: 'Project 1 description',
					tags: ['React', 'TypeScript'],
					title: 'Project 1',
					type: 'Web Showcases',
					url: 'https://project1.com',
				},
				{
					description: 'Project 2 description',
					tags: ['Node.js', 'Express'],
					title: 'Project 2',
					type: 'Web Showcases',
					url: 'https://project2.com',
				},
			];

			const result = getProjectsSchema(mockWebsite, mockProjects) as SchemaObject;

			expect(result['@context']).toBe('https://schema.org');
			expect(result['@type']).toBe('CollectionPage');
			expect(result['@id']).toBe('https://example.com/');
			expect(result.name).toBe('Projects | Ruslan Pashkov');
			expect(result.creator['@type']).toBe('Person');
			expect(result.mainEntity['@type']).toBe('ItemList');
			expect(result.mainEntity.itemListElement).toHaveLength(2);
			expect(result.mainEntity.itemListElement[0]['@type']).toBe('ListItem');
			expect(result.mainEntity.itemListElement[0].position).toBe(1);
			expect(result.mainEntity.itemListElement[1].position).toBe(2);
		});

		it('should handle empty projects array', () => {
			const result = getProjectsSchema(mockWebsite, []) as SchemaObject;

			expect(result.mainEntity.itemListElement).toHaveLength(0);
		});

		it('should include creative work schemas', () => {
			const mockProjects: Project[] = [
				{
					description: 'Test project',
					tags: ['React'],
					title: 'Test Project',
					type: 'Utilities',
					url: 'https://test.com',
				},
			];

			const result = getProjectsSchema(mockWebsite, mockProjects) as SchemaObject;

			const listItem = result.mainEntity.itemListElement[0];

			expect(listItem.item['@type']).toBe('CreativeWork');
			expect(listItem.item.name).toBe('Test Project');
			expect(listItem.item.description).toBe('Test project');
			expect(listItem.item.keywords).toBe('React');
			expect(listItem.item.url).toBe('https://test.com');
		});
	});

	describe('getBreadcrumbsSchema', () => {
		it('should generate valid breadcrumbs schema', () => {
			const mockBreadcrumbs: Link[] = [
				{ title: 'Home', url: '/' },
				{ title: 'Blog', url: '/blog/' },
				{ title: 'Article', url: '/blog/article/' },
			];

			const result = getBreadcrumbsSchema(mockWebsite, mockBreadcrumbs) as SchemaObject;

			expect(result['@context']).toBe('https://schema.org');
			expect(result['@type']).toBe('BreadcrumbList');
			expect(result['@id']).toBe('https://example.com/');
			expect(result.itemListElement).toHaveLength(3);
			expect(result.itemListElement[0]['@type']).toBe('ListItem');
			expect(result.itemListElement[0].position).toBe(1);
			expect(result.itemListElement[0].item['@type']).toBe('WebPage');
			expect(result.itemListElement[0].item.name).toBe('Home');
			expect(result.itemListElement[1].position).toBe(2);
			expect(result.itemListElement[1].item.name).toBe('Blog');
			expect(result.itemListElement[2].position).toBe(3);
			expect(result.itemListElement[2].item.name).toBe('Article');
		});

		it('should handle empty breadcrumbs array', () => {
			const result = getBreadcrumbsSchema(mockWebsite, []) as SchemaObject;

			expect(result.itemListElement).toHaveLength(0);
		});

		it('should handle single breadcrumb', () => {
			const mockBreadcrumbs: Link[] = [{ title: 'Home', url: '/' }];

			const result = getBreadcrumbsSchema(mockWebsite, mockBreadcrumbs) as SchemaObject;

			expect(result.itemListElement).toHaveLength(1);
			expect(result.itemListElement[0].position).toBe(1);
			expect(result.itemListElement[0].item.name).toBe('Home');
		});
	});
});
