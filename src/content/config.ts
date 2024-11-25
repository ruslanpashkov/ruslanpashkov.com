import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		categories: z.array(z.string()),
		description: z.string(),
		publishedAt: z.string(),
		title: z.string(),
		topic: z.string(),
		updatedAt: z.optional(z.string()),
	}),
	type: 'content',
});

export const collections = { blog };
