import { contacts } from '@/data/contacts';
import { descriptions } from '@/data/descriptions';
import { global } from '@/data/global';
import { findEmailURL, findOnlineProfilesURLs } from '@/utils/contact';
import { sortByType } from '@/utils/project';
import { generateTitle } from '@/utils/seo';
import type { CollectionPage, CreativeWork, ListItem, WithContext } from 'schema-dts';
import type { Project } from '@/types/Project';

export const getProjectsSchema = (
	website: URL,
	projects: Project[],
): WithContext<CollectionPage> => {
	const email = findEmailURL(contacts);
	const onlineProfiles = findOnlineProfilesURLs(contacts);
	const title = generateTitle('Projects');
	const sortedProjects = sortByType(projects);
	const creativeWorks = sortedProjects.map(buildCreativeWorkSchema);
	const projectItems = creativeWorks.map(buildListItemSchema);

	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': website.href,
		name: title,
		description: descriptions.projects,
		url: website.href,
		creator: {
			'@type': 'Person',
			name: global.author,
			jobTitle: global.job.position,
			email: email,
			sameAs: onlineProfiles,
		},
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: projectItems,
		},
	};
};

function buildCreativeWorkSchema(project: Project): CreativeWork {
	const keywords = project.tags.join(', ');

	return {
		'@type': 'CreativeWork',
		name: project.title,
		description: project.description,
		url: project.url,
		author: {
			'@type': 'Person',
			name: global.author,
		},
		keywords: keywords,
	};
}

function buildListItemSchema(creativeWorks: CreativeWork, index: number): ListItem {
	const position = index + 1;

	return {
		'@type': 'ListItem',
		position: position,
		item: creativeWorks,
	};
}
