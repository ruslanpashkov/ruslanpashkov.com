import type { Project } from '@/types/Project';
import type { CollectionPage, CreativeWork, ListItem, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { descriptions } from '@/data/descriptions';
import { global } from '@/data/global';
import { getPageTitle } from '@/utils/getPageTitle';
import { sortProjectsByType } from '@/utils/sortProjectsByType';

export function getProjectsSchema(website: URL, projects: Project[]): WithContext<CollectionPage> {
	const [email, ...otherContacts] = contacts.map((contact) => contact.url);
	const title = getPageTitle('Projects');
	const sortedProjects = sortProjectsByType(projects);
	const creativeWorks: CreativeWork[] = sortedProjects.map(buildCreativeWorkSchema);
	const projectItems: ListItem[] = creativeWorks.map(buildListItemSchema);

	return {
		'@context': 'https://schema.org',
		'@id': website.href,
		'@type': 'CollectionPage',
		creator: {
			'@type': 'Person',
			email: email,
			jobTitle: global.job.position,
			name: global.author,
			sameAs: otherContacts,
		},
		description: descriptions.projects,
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: projectItems,
		},
		name: title,
		url: website.href,
	};
}

function buildCreativeWorkSchema(project: Project): CreativeWork {
	const keywords = project.tags.join(', ');

	return {
		'@type': 'CreativeWork',
		author: {
			'@type': 'Person',
			name: global.author,
		},
		description: project.description,
		keywords: keywords,
		name: project.title,
		url: project.url,
	};
}

function buildListItemSchema(creativeWorks: CreativeWork, index: number): ListItem {
	const position = index + 1;

	return {
		'@type': 'ListItem',
		item: creativeWorks,
		position: position,
	};
}
