import { contacts } from '@/data/contacts';
import { global } from '@/data/global';
import { findEmailURL, findOnlineProfilesURLs } from '@/utils/contact';
import type { BlogPosting, WithContext } from 'schema-dts';
import type { Article } from '@/types/Article';

export const getArticleSchema = (website: URL, article: Article): WithContext<BlogPosting> => {
	const {
		data: { publishedAt, updatedAt, slug, title, description, categories, topic },
	} = article;
	const email = findEmailURL(contacts);
	const onlineProfiles = findOnlineProfilesURLs(contacts);
	const articleURL = new URL(`/blog/${slug}/`, website);
	const previewImageURL = new URL(`/images/previews/${slug}.png`, website);
	const datePublished = publishedAt.toISOString();
	const dateModified = updatedAt ? updatedAt.toISOString() : datePublished;
	const keywords = categories.join(', ');

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': articleURL.href,
		headline: title,
		description: description,
		url: articleURL.href,
		author: {
			'@type': 'Person',
			name: global.author,
			email: email,
			url: website.origin,
			sameAs: onlineProfiles,
		},
		publisher: {
			'@type': 'Person',
			name: global.author,
			email: email,
			url: website.origin,
			sameAs: onlineProfiles,
		},
		datePublished: datePublished,
		dateModified: dateModified,
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
};
