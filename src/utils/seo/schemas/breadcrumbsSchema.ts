import type { BreadcrumbList, ListItem, WithContext } from 'schema-dts';
import type { Link } from '@/types/Link';

export const getBreadcrumbsSchema = (
	website: URL,
	breadcrumbs: Link[],
): WithContext<BreadcrumbList> => {
	const breadcrumbsList = breadcrumbs.map(buildListItemSchema);

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		'@id': website.href,
		itemListElement: breadcrumbsList,
	};
};

function buildListItemSchema(crumb: Link, index: number): ListItem {
	const crumbURL = new URL(crumb.url, import.meta.env.SITE);
	const position = index + 1;

	return {
		'@type': 'ListItem',
		position: position,
		item: {
			'@type': 'WebPage',
			'@id': crumbURL.href,
			name: crumb.title,
		},
	};
}
