import type { Article } from '@/types/Article';
import type { BlogPosting, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { global } from '@/data/global';
import { ContactManager } from '@/utils/contact';
import { FormattingManager } from '@/utils/formatting';
import { MarkdownManager } from '@/utils/markdown';

export function getArticleSchema(website: URL, article: Article): WithContext<BlogPosting> {
	const {
		body,
		data: { categories, description, publishedAt, slug, title, topic },
	} = article;
	const email = ContactManager.findEmailURL(contacts);
	const onlineProfiles = ContactManager.findOnlineProfilesURLs(contacts);
	const articleURL = new URL(`/blog/${slug}/`, website);
	const previewImageURL = new URL(`/images/previews/${slug}.png`, website);
	const datePublished = new Date(FormattingManager.formatDate(publishedAt)).toISOString();
	const keywords = categories.join(', ');
	const cleanContent = MarkdownManager.clean(body!);

	return {
		'@context': 'https://schema.org',
		'@id': articleURL.href,
		'@type': 'BlogPosting',
		about: {
			'@type': 'Thing',
			name: topic,
		},
		articleBody: cleanContent,
		articleSection: categories,
		author: {
			'@type': 'Person',
			email: email,
			name: global.author,
			sameAs: onlineProfiles,
			url: website.origin,
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
			email: email,
			name: global.author,
			sameAs: onlineProfiles,
			url: website.origin,
		},
		url: articleURL.href,
	};
}
