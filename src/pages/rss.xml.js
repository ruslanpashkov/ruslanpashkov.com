import { global } from '@/data/global';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const blog = await getCollection('blog');

	return rss({
		description: global.about,
		items: blog.map((post) => ({
			categories: post.data.categories,
			description: post.data.description,
			link: `/blog/${post.slug}/`,
			pubDate: post.data.pubDate,
			title: post.data.title,
		})),
		site: context.site,
		stylesheet: '/rss/styles.xsl',
		title: `${global.author}'s Blog`,
	});
}
