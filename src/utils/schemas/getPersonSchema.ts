import type { Language, Person, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { global } from '@/data/global';
import { getLanguageCode } from '@/utils/getLanguageCode';

export function getPersonSchema(website: URL): WithContext<Person> {
	const [firstName, lastName] = global.author.split(' ');
	const [email, ...otherContacts] = contacts.map((contact) => contact.url);
	const portraitURL = new URL('/images/portrait.jpg', website);
	const knownLanguages: Language[] = global.languages.map(buildLanguageSchema);

	return {
		'@context': 'https://schema.org',
		'@id': website.href,
		'@type': 'Person',
		alumniOf: 'Unknown',
		birthDate: global.birthDate,
		description: global.about,
		email: email,
		familyName: lastName,
		gender: global.gender,
		givenName: firstName,
		image: portraitURL.href,
		jobTitle: global.job.position,
		knowsAbout: global.skills,
		knowsLanguage: knownLanguages,
		name: global.author,
		nationality: {
			'@type': 'Country',
			name: global.country,
		},
		sameAs: otherContacts,
		telephone: global.phone,
		url: website.href,
		worksFor: {
			'@type': 'Organization',
			name: global.job.name,
		},
	};
}

function buildLanguageSchema(language: string): Language {
	return {
		'@type': 'Language',
		alternateName: getLanguageCode(language),
		name: language,
	};
}
