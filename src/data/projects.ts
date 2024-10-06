import type { Project } from '@/types/Project';

export const projects: Project[] = [
	{
		tags: ['TypeScript', 'Next.js', 'Fastify', 'Tailwind CSS', 'Neon DB', 'Prisma ORM'],
		title: 'User Dashboard',
		url: 'https://ui-user-dashboard.vercel.app',
	},
	{
		tags: ['TypeScript', 'React', 'Material UI'],
		title: 'Password Generator',
		url: 'https://mui-password-generator.vercel.app',
	},
	{
		tags: [
			'TypeScript',
			'React',
			'SCSS',
			'Express.js',
			'PostgreSQL',
			'Sequelize',
			'SWC',
			'Vite',
		],
		title: 'Product Catalog',
		url: 'https://react-product-catalog.vercel.app',
	},
	{
		tags: ['TypeScript', 'React', 'React Router', 'SCSS', 'Node.js', 'Fastify'],
		title: 'TodoMVC Clone',
		url: 'https://todomvc-application.vercel.app',
	},
	{
		tags: ['HTML5', 'JavaScript', 'SCSS', 'BEM', 'AOS'],
		title: 'MET Landing Page',
		url: 'https://met-landing-page.vercel.app/',
	},
];
