import type { Project } from '@/types/Project';

export const projects: Project[] = [
	{
		description:
			"User dashboard with authentication, user profile and settings. Verified users can also access the image editor under the home page. Don't ask me why I made it on Next.js.",
		tags: ['TypeScript', 'Next.js', 'Fastify', 'Tailwind CSS', 'Neon DB', 'Prisma ORM'],
		title: 'User Dashboard',
		type: 'Web Showcases',
		url: 'https://ui-user-dashboard.vercel.app',
	},
	{
		description:
			'Password generator with a variety of options to customize the generated password. The password can be copied to the clipboard and stored in the browser. Strict mode is insane.',
		tags: ['TypeScript', 'React', 'Material UI'],
		title: 'Password Generator',
		type: 'Utilities',
		url: 'https://mui-password-generator.vercel.app',
	},
	{
		description:
			"Product catalog with Apple products and a shopping cart. Do we need a user verification system and more new IPhones in database? I don't think so.",
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
		type: 'Web Showcases',
		url: 'https://react-product-catalog.vercel.app',
	},
	{
		description:
			"Just TODO. Nothing more. Nothing less. I also made a cute Fastify server to handle the API requests. It was fun to make in 2022, but now it's fun to look at it.",
		tags: ['TypeScript', 'React', 'React Router', 'SCSS', 'Node.js', 'Fastify'],
		title: 'TodoMVC Clone',
		type: 'Web Showcases',
		url: 'https://todomvc-application.vercel.app',
	},
	{
		description:
			'MET? MET! Simple Landing page for the MET Museum. It was my first serious project that I have worked on. AOS animations are cool, right?',
		tags: ['HTML5', 'JavaScript', 'SCSS', 'BEM', 'AOS'],
		title: 'MET Landing Page',
		type: 'Web Showcases',
		url: 'https://met-landing-page.vercel.app',
	},
];
