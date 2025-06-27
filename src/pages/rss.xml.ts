import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { global } from '@/data/global';
import { sortByDate } from '@/utils/article';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const blog = await getCollection('blog');

	return rss({
		site: context.site!,
		title: `${global.author}'s Blog`,
		description: global.about,
		stylesheet: '/rss/styles.xsl',
		items: sortByDate(blog).map(({ data: post }) => ({
			title: post.title,
			description: post.description,
			categories: post.categories,
			link: `/blog/${post.slug}/`,
			pubDate: new Date(post.publishedAt),
		})),
	});
}
