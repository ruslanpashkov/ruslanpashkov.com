const strategies = [
	{
		matches: (id) => id.includes('three/examples/jsm'),
		name: 'three-addons',
		priority: 1,
	},
	{
		matches: (id) => id.includes('three') && !id.includes('three/examples/jsm'),
		name: 'three-core',
		priority: 2,
	},
	{
		matches: (id) => id.includes('typewriter-effect'),
		name: 'typewriter',
		priority: 3,
	},
	{
		matches: (id) => id.includes('node_modules'),
		name: 'vendor',
		priority: 4,
	},
];

function getChunkName(id) {
	const matchedStrategy = strategies.find((strategy) => strategy.matches(id));

	return matchedStrategy ? matchedStrategy.name : null;
}

export { getChunkName };
