import type { APIContext } from 'astro';

import { global } from '@/data/global';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
	const blog = await getCollection('blog');

	return rss({
		description: global.about,
		items: blog.map((post) => ({
			categories: post.data.categories,
			description: post.data.description,
			link: `/blog/${post.slug}/`,
			publishedAt: new Date(post.data.publishedAt),
			title: post.data.title,
		})),
		site: context.site!,
		stylesheet: '/rss/styles.xsl',
		title: `${global.author}'s Blog`,
	});
}
