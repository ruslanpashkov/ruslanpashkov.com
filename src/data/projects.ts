import type { Project } from '@/types/Project';

export const projects: Project[] = [
	{
		description:
			"What is recursion? Well, it's simple - just click this button to find out what recursion is. The answer leads to more questions. And more.. And more...",
		tags: ['HTML', 'CSS', 'JavaScript'],
		title: 'Just One More',
		type: 'Web Showcases',
		url: '/projects/just-one-more/',
	},
	{
		description:
			"Password generator that actually works! Browser extension for those who are tired of using '123456' as their password. Generate strong passwords with just one click.",
		tags: ['TypeScript', 'React', 'Material UI', 'Zustand', 'WXT'],
		title: 'NovaPass',
		type: 'Utilities',
		url: '/projects/novapass/',
	},
	{
		description:
			"Led a team of 5 devs to build a product catalog for Apple stuff with a cart. Another iPhone model? Please, we already have enough in our DB.",
		tags: ['TypeScript', 'React', 'SCSS', 'Express.js', 'PostgreSQL', 'Sequelize'],
		title: 'Nice Gadgets',
		type: 'Web Showcases',
		url: '/projects/nice-gadgets/',
	},
	{
		description:
			"Just TODO. Nothing more. Nothing less. I also made a cute Fastify server to handle the API requests. It was fun to make in 2022, but now it's fun to look at it.",
		tags: ['TypeScript', 'React', 'React Router', 'SCSS', 'Fastify'],
		title: 'TodoMVC Clone',
		type: 'Web Showcases',
		url: '/projects/todomvc-clone/',
	},
	{
		description:
			'MET? MET! Simple Landing page for the MET Museum. It was my first serious project that I have worked on. AOS animations are cool, right?',
		tags: ['HTML', 'SCSS', 'BEM', 'JavaScript', 'AOS'],
		title: 'MET Exhibition',
		type: 'Web Showcases',
		url: '/projects/met-exhibition/',
	},
];
