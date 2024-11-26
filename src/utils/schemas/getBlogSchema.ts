import type { Article } from '@/types/Article';
import type { Blog, BlogPosting, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { descriptions } from '@/data/descriptions';
import { global } from '@/data/global';
import { formatDate } from '@/utils/formatDate';
import { getPageTitle } from '@/utils/getPageTitle';
import { sortArticlesByDate } from '@/utils/sortArticlesByDate';
import removeMarkdown from 'remove-markdown';

export function getBlogSchema(website: URL, articles: Article[]): WithContext<Blog> {
	const [email, ...otherContacts] = contacts.map((contact) => contact.url);
	const title = getPageTitle('Blog');
	const sortedArticles = sortArticlesByDate(articles);
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
			sameAs: otherContacts,
			url: website.origin,
		},
	};
}

function buildBlogPostSchema(article: Article): BlogPosting {
	const {
		body,
		data: { categories, description, publishedAt, title, topic },
		slug,
	} = article;
	const articleURL = new URL(`/blog/${slug}/`, import.meta.env.SITE);
	const previewImageURL = new URL(`/images/previews/${slug}.png`, import.meta.env.SITE);
	const datePublished = formatDate(publishedAt);
	const keywords = categories.join(', ');
	const cleanContent = removeMarkdown(body);

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
