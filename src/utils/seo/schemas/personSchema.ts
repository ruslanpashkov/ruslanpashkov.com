import type { Language, Person, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { global } from '@/data/global';
import { ContactManager } from '@/utils/contact';
import { FormattingManager } from '@/utils/formatting';

export function getPersonSchema(website: URL): WithContext<Person> {
	const [firstName, lastName] = global.author.split(' ');
	const email = ContactManager.findEmailURL(contacts);
	const onlineProfiles = ContactManager.findOnlineProfilesURLs(contacts);
	const portraitURL = new URL('/images/portrait.jpg', website);
	const knownLanguages = global.languages.map(buildLanguageSchema);

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
		knowsAbout: global.proficiencies,
		knowsLanguage: knownLanguages,
		name: global.author,
		nationality: {
			'@type': 'Country',
			name: global.country,
		},
		sameAs: onlineProfiles,
		url: website.href,
		worksFor: {
			'@type': 'Organization',
			name: global.job.name,
		},
	};
}

function buildLanguageSchema(language: string): Language {
	const languageCode = FormattingManager.shortenLanguage(language);

	return {
		'@type': 'Language',
		alternateName: languageCode,
		name: language,
	};
}
