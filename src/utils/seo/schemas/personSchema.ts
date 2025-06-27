import { contacts } from '@/data/contacts';
import { global } from '@/data/global';
import { findEmailURL, findOnlineProfilesURLs } from '@/utils/contact';
import { shortenLanguage } from '@/utils/formatting';
import type { Language, Person, WithContext } from 'schema-dts';

export const getPersonSchema = (website: URL): WithContext<Person> => {
	const [firstName, lastName] = global.author.split(' ');
	const email = findEmailURL(contacts);
	const onlineProfiles = findOnlineProfilesURLs(contacts);
	const knownLanguages = global.languages.map(buildLanguageSchema);

	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': website.href,
		name: global.author,
		description: global.about,
		url: website.href,
		email: email,
		givenName: firstName,
		familyName: lastName,
		jobTitle: global.job.position,
		worksFor: {
			'@type': 'Organization',
			name: global.job.name,
		},
		sameAs: onlineProfiles,
		knowsAbout: global.proficiencies,
		knowsLanguage: knownLanguages,
		nationality: {
			'@type': 'Country',
			name: global.country,
		},
		birthDate: global.birthDate,
		gender: global.gender,
		alumniOf: 'Unknown',
	};
};

function buildLanguageSchema(language: string): Language {
	const languageCode = shortenLanguage(language);

	return {
		'@type': 'Language',
		name: language,
		alternateName: languageCode,
	};
}
