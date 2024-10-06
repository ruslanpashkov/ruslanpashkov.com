import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		categories: z.array(z.string()),
		description: z.string(),
		pubDate: z.string(),
		title: z.string(),
		toc: z.optional(z.array(z.string())),
		topic: z.string(),
	}),
	type: 'content',
});

export const collections = { blog };
