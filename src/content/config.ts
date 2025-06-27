import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: 'src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		publishedAt: z.string(),
		updatedAt: z.optional(z.string()),
		slug: z.string(),
		title: z.string(),
		description: z.string(),
		categories: z.array(z.string()),
		topic: z.string(),
	}),
});

export const collections = { blog };
