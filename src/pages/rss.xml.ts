import type { APIContext } from 'astro';

import { global } from '@/data/global';
import { sortByDate } from '@/utils/article';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
	const blog = await getCollection('blog');

	return rss({
		description: global.about,
		items: sortByDate(blog).map(({ data: post }) => ({
			categories: post.categories,
			description: post.description,
			link: `/blog/${post.slug}/`,
			pubDate: new Date(post.publishedAt),
			title: post.title,
		})),
		site: context.site!,
		stylesheet: '/rss/styles.xsl',
		title: `${global.author}'s Blog`,
	});
}
