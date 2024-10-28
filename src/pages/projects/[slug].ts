import type { APIRoute } from 'astro';

import { redirects } from '@/constants/redirects';

export const GET: APIRoute = ({ params, props, redirect }) => {
	const { slug } = params;
	const { link } = props;

	if (!slug) {
		return new Response(null, {
			status: 400,
			statusText: 'Bad request',
		});
	}

	if (!link) {
		return new Response(null, {
			status: 404,
			statusText: 'Not found',
		});
	}

	return redirect(link, 301);
};

export async function getStaticPaths() {
	return Object.entries(redirects.projects).map(([slug, link]) => ({
		params: { slug },
		props: { link },
	}));
}
