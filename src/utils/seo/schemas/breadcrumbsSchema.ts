import type { Link } from '@/types/Link';
import type { BreadcrumbList, ListItem, WithContext } from 'schema-dts';

export function getBreadcrumbsSchema(
	website: URL,
	breadcrumbs: Link[],
): WithContext<BreadcrumbList> {
	const breadcrumbsList = breadcrumbs.map(buildListItemSchema);

	return {
		'@context': 'https://schema.org',
		'@id': website.href,
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbsList,
	};
}

function buildListItemSchema(crumb: Link, index: number): ListItem {
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
