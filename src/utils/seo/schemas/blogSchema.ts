import { contacts } from '@/data/contacts';
import { descriptions } from '@/data/descriptions';
import { global } from '@/data/global';
import { sortByDate } from '@/utils/article';
import { findEmailURL, findOnlineProfilesURLs } from '@/utils/contact';
import { clean } from '@/utils/markdown';
import { generateTitle } from '@/utils/seo';
import type { Blog, BlogPosting, WithContext } from 'schema-dts';
import type { Article } from '@/types/Article';

export const getBlogSchema = (website: URL, articles: Article[]): WithContext<Blog> => {
	const email = findEmailURL(contacts);
	const onlineProfiles = findOnlineProfilesURLs(contacts);
	const title = generateTitle('Blog');
	const sortedArticles = sortByDate(articles);
	const posts = sortedArticles.map(buildBlogPostSchema);

	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': website.href,
		name: title,
		description: descriptions.articles,
		author: {
			'@type': 'Person',
			name: global.author,
			url: website.origin,
		},
		publisher: {
			'@type': 'Person',
			name: global.author,
			email: email,
			url: website.origin,
			sameAs: onlineProfiles,
		},
		blogPost: posts,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': website.href,
		},
	};
};

function buildBlogPostSchema(article: Article): BlogPosting {
	const {
		body,
		data: { publishedAt, slug, title, description, categories, topic },
	} = article;
	const articleURL = new URL(`/blog/${slug}/`, import.meta.env.SITE);
	const previewImageURL = new URL(`/images/previews/${slug}.png`, import.meta.env.SITE);
	const datePublished = new Date(publishedAt).toISOString();
	const keywords = categories.join(', ');
	const cleanContent = clean(body as string);

	return {
		'@type': 'BlogPosting',
		headline: title,
		description: description,
		url: articleURL.href,
		author: {
			'@type': 'Person',
			name: global.author,
			url: import.meta.env.SITE,
		},
		publisher: {
			'@type': 'Person',
			name: global.author,
		},
		datePublished: datePublished,
		articleBody: cleanContent,
		about: {
			'@type': 'Thing',
			name: topic,
		},
		image: {
			'@type': 'ImageObject',
			url: previewImageURL.href,
			width: '1200',
			height: '630',
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': articleURL.href,
		},
		articleSection: categories,
		keywords: keywords,
		inLanguage: 'en',
	};
}
