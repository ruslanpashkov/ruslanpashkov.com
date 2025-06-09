import type { Blog, BlogPosting, WithContext } from 'schema-dts';

import type { Article } from '@/types/Article';

import { contacts } from '@/data/contacts';
import { descriptions } from '@/data/descriptions';
import { global } from '@/data/global';
import { sortByDate } from '@/utils/article';
import { findEmailURL, findOnlineProfilesURLs } from '@/utils/contact';
import { formatDate } from '@/utils/formatting';
import { clean } from '@/utils/markdown';
import { generateTitle } from '@/utils/seo';

export const getBlogSchema = (website: URL, articles: Article[]): WithContext<Blog> => {
	const email = findEmailURL(contacts);
	const onlineProfiles = findOnlineProfilesURLs(contacts);
	const title = generateTitle('Blog');
	const sortedArticles = sortByDate(articles);
	const posts = sortedArticles.map(buildBlogPostSchema);

	return {
		'@context': 'https://schema.org',
		'@id': website.href,
		'@type': 'Blog',
		author: {
			'@type': 'Person',
			name: global.author,
			url: website.origin,
		},
		blogPost: posts,
		description: descriptions.articles,
		mainEntityOfPage: {
			'@id': website.href,
			'@type': 'WebPage',
		},
		name: title,
		publisher: {
			'@type': 'Person',
			email: email,
			name: global.author,
			sameAs: onlineProfiles,
			url: website.origin,
		},
	};
};

function buildBlogPostSchema(article: Article): BlogPosting {
	const {
		body,
		data: { categories, description, publishedAt, slug, title, topic },
	} = article;
	const articleURL = new URL(`/blog/${slug}/`, import.meta.env.SITE);
	const previewImageURL = new URL(`/images/previews/${slug}.png`, import.meta.env.SITE);
	const datePublished = new Date(formatDate(publishedAt)).toISOString();
	const keywords = categories.join(', ');
	const cleanContent = clean(body as string);

	return {
		'@type': 'BlogPosting',
		about: {
			'@type': 'Thing',
			name: topic,
		},
		articleBody: cleanContent,
		articleSection: categories,
		author: {
			'@type': 'Person',
			name: global.author,
			url: import.meta.env.SITE,
		},
		datePublished: datePublished,
		description: description,
		headline: title,
		image: {
			'@type': 'ImageObject',
			height: '630',
			url: previewImageURL.href,
			width: '1200',
		},
		inLanguage: 'en',
		keywords: keywords,
		mainEntityOfPage: {
			'@id': articleURL.href,
			'@type': 'WebPage',
		},
		publisher: {
			'@type': 'Person',
			name: global.author,
		},
		url: articleURL.href,
	};
}
