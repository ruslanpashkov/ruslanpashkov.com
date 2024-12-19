import type { Crumb } from '@/types/Crumb';
import type { BreadcrumbList, ListItem, WithContext } from 'schema-dts';

export function getBreadcrumbsSchema(
	website: URL,
	breadcrumbs: Crumb[],
): WithContext<BreadcrumbList> {
	const breadcrumbsList = breadcrumbs.map(buildListItemSchema);

	return {
		'@context': 'https://schema.org',
		'@id': website.href,
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbsList,
	};
}

function buildListItemSchema(crumb: Crumb, index: number): ListItem {
	const crumbURL = new URL(crumb.url, import.meta.env.SITE);
	const position = index + 1;

	return {
		'@type': 'ListItem',
		item: {
			'@id': crumbURL.href,
			'@type': 'WebPage',
			name: crumb.label,
		},
		position: position,
	};
}
