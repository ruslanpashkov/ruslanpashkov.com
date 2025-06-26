const CHUNK_STRATEGIES = [
	{
		matches: (id) => id.includes('three') && id.includes('core'),
		name: 'three-core',
	},
	{
		matches: (id) => id.includes('three') && id.includes('modules'),
		name: 'three-modules',
	},
	{
		matches: (id) => id.includes('three') && id.includes('examples'),
		name: 'three-examples',
	},
	{
		matches: (id) => id.includes('three'),
		name: 'three-misc',
	},
	{
		matches: (id) => id.includes('node_modules'),
		name: 'vendor',
	},
];

function getChunkName(id) {
	const matchedStrategy = CHUNK_STRATEGIES.find((strategy) => strategy.matches(id));
	return matchedStrategy ? matchedStrategy.name : null;
}

export { getChunkName };
