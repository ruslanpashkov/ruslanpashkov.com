import type { Language, Person, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { global } from '@/data/global';
import { findEmailURL, findOnlineProfilesURLs } from '@/utils/contact';
import { shortenLanguage } from '@/utils/formatting';

export const getPersonSchema = (website: URL): WithContext<Person> => {
	const [firstName, lastName] = global.author.split(' ');
	const email = findEmailURL(contacts);
	const onlineProfiles = findOnlineProfilesURLs(contacts);
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
};

function buildLanguageSchema(language: string): Language {
	const languageCode = shortenLanguage(language);

	return {
		'@type': 'Language',
		alternateName: languageCode,
		name: language,
	};
}
