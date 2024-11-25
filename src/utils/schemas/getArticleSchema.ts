import type { Article } from '@/types/Article';
import type { BlogPosting, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { global } from '@/data/global';
import { formatDate } from '@/utils/formatDate';
import { getPageTitle } from '@/utils/getPageTitle';

export function getArticleSchema(website: URL, article: Article): WithContext<BlogPosting> {
	const [email, ...otherContacts] = contacts.map((contact) => contact.url);
	const {
		body,
		data: { categories, description, publishedAt, title, topic },
		slug,
	} = article;
	const articleURL = new URL(`/blog/${slug}/`, website);
	const previewImageURL = new URL(`/images/previews/${slug}.png`, website);
	const datePublished = formatDate(publishedAt);
	const keywords = categories.join(', ');
	const pageTitle = getPageTitle(title);

	return {
		'@context': 'https://schema.org',
		'@id': articleURL.href,
		'@type': 'BlogPosting',
		about: {
			'@type': 'Thing',
			name: topic,
		},
		articleBody: body,
		articleSection: categories,
		author: {
			'@type': 'Person',
			email: email,
			name: global.author,
			sameAs: otherContacts,
			url: website.origin,
		},
		datePublished: datePublished,
		description: description,
		headline: pageTitle,
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
			sameAs: otherContacts,
			url: website.origin,
		},
		url: articleURL.href,
	};
}
