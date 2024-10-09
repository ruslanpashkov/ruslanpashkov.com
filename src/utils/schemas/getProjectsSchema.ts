import type { Project } from '@/types/Project';
import type { CreativeWork, ListItem, WebPage, WithContext } from 'schema-dts';

import { contacts } from '@/data/contacts';
import { descriptions } from '@/data/descriptions';
import { global } from '@/data/global';
import { projects } from '@/data/projects';
import { getPageTitle } from '@/utils/getPageTitle';
import { sortProjectsByType } from '@/utils/sortProjectsByType';

export function getProjectsSchema(website: URL): WithContext<WebPage> {
	const [email, ...otherContacts] = contacts.map((contact) => contact.url);
	const title = getPageTitle('Projects');
	const sortedProjects = sortProjectsByType(projects);
	const creativeWorks: CreativeWork[] = sortedProjects.map(buildCreativeWorkSchema);
	const projectItems: ListItem[] = creativeWorks.map(buildListItemSchema);

	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
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
	return {
		'@type': 'CreativeWork',
		description: project.description,
		name: project.title,
		url: project.url,
	};
}

function buildListItemSchema(creativeWorks: CreativeWork, index: number): ListItem {
	return {
		'@type': 'ListItem',
		item: creativeWorks,
		position: index + 1,
	};
}
