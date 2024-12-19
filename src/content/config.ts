import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	loader: glob({ base: 'src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		categories: z.array(z.string()),
		description: z.string(),
		publishedAt: z.string(),
		slug: z.string(),
		title: z.string(),
		topic: z.string(),
		updatedAt: z.optional(z.string()),
	}),
});

export const collections = { blog };
