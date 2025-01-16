import type { Article } from '@/types/Article';
import type { Blog, BlogPosting, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { descriptions } from '@/data/descriptions';
import { global } from '@/data/global';
import { ArticleManager } from '@/utils/article';
import { ContactManager } from '@/utils/contact';
import { FormattingManager } from '@/utils/formatting';
import { MarkdownManager } from '@/utils/markdown';

import { generateTitle } from '../generateTitle';

export function getBlogSchema(website: URL, articles: Article[]): WithContext<Blog> {
	const email = ContactManager.findEmailURL(contacts);
	const onlineProfiles = ContactManager.findOnlineProfilesURLs(contacts);
	const title = generateTitle('Blog');
	const sortedArticles = ArticleManager.sortByDate(articles);
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
}

function buildBlogPostSchema(article: Article): BlogPosting {
	const {
		body,
		data: { categories, description, publishedAt, slug, title, topic },
	} = article;
	const articleURL = new URL(`/blog/${slug}/`, import.meta.env.SITE);
	const previewImageURL = new URL(`/images/previews/${slug}.png`, import.meta.env.SITE);
	const datePublished = new Date(FormattingManager.formatDate(publishedAt)).toISOString();
	const keywords = categories.join(', ');
	const cleanContent = MarkdownManager.clean(body!);

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
