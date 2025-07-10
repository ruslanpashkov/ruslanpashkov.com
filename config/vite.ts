import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import type { AstroUserConfig } from 'astro';

export const vite: AstroUserConfig['vite'] = {
	build: {
		target: browserslistToEsbuild(browserslist()),
		rollupOptions: {
			output: {
				manualChunks: (id: string) => {
					const chunkStrategies = [
						{
							matches: (id: string) => id.includes('three') && id.includes('core'),
							name: 'three-core',
						},
						{
							matches: (id: string) => id.includes('three') && id.includes('modules'),
							name: 'three-modules',
						},
						{
							matches: (id: string) =>
								id.includes('three') && id.includes('examples'),
							name: 'three-examples',
						},
						{
							matches: (id: string) => id.includes('three'),
							name: 'three-misc',
						},
						{
							matches: (id: string) => id.includes('typewriter'),
							name: 'typewriter',
						},
						{
							matches: (id: string) => id.includes('node_modules'),
							name: 'vendor',
						},
					];

					const matchedStrategy = chunkStrategies.find((strategy) =>
						strategy.matches(id),
					);

					return matchedStrategy ? matchedStrategy.name : null;
				},
			},
		},
	},
	css: {
		transformer: 'lightningcss',
	},
};
