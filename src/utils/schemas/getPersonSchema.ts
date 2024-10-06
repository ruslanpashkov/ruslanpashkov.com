import type { Person, WithContext } from 'schema-dts';

import { global } from '@/data/global';

export function getPersonSchema(): WithContext<Person> {
	const [firstName, lastName] = global.author.split(' ');

	return {
		'@context': 'https://schema.org',
		'@id': 'https://ruslanpashkov.com',
		'@type': 'Person',
		alumniOf: 'Unknown',
		description: global.about,
		email: global.email,
		familyName: lastName,
		gender: 'Male',
		givenName: firstName,
		image: 'https://ruslanpashkov.com/images/portrait.jpg',
		jobTitle: 'Lead Frontend Engineer',
		knowsAbout: [
			'JavaScript',
			'TypeScript',
			'Frontend Engineering',
			'Web Development',
			'Web Standards',
		],
		knowsLanguage: [
			{
				'@type': 'Language',
				alternateName: 'en',
				name: 'English',
			},
			{
				'@type': 'Language',
				alternateName: 'ru',
				name: 'Russian',
			},
			{
				'@type': 'Language',
				alternateName: 'uk',
				name: 'Ukrainian',
			},
		],
		name: global.author,
		nationality: {
			'@type': 'Country',
			name: 'Ukraine',
		},
		sameAs: [
			'https://x.com/ruslanpashkov',
			'https://mastodon.social/@ruslanpashkov',
			'https://www.linkedin.com/in/ruslanpashkov',
			'https://t.me/ruslanpashkov',
			'https://github.com/0o22',
			'https://gitlab.com/0o22',
		],
		url: 'https://ruslanpashkov.com',
		worksFor: {
			'@type': 'Organization',
			name: 'Wiew',
		},
	};
}
