class ChunkManager {
	constructor() {
		this.strategies = [];
	}

	addStrategies(...strategies) {
		strategies.forEach((strategy) => this.addStrategy(strategy));
		return this;
	}

	addStrategy(strategy) {
		this.strategies.push(strategy);
		this.strategies.sort((strategyA, strategyB) => strategyA.priority - strategyB.priority);

		return this;
	}

	getChunkName(id) {
		for (const strategy of this.strategies) {
			if (strategy.matches(id)) {
				return strategy.getChunkName();
			}
		}

		return null;
	}
}

class ChunkStrategy {
	constructor(name, priority = 0) {
		this.name = name;
		this.priority = priority;
	}

	getChunkName() {
		return this.name;
	}

	matches() {
		throw new Error('matches() must be implemented by subclass');
	}
}

class ThreeAddonsStrategy extends ChunkStrategy {
	constructor() {
		super('three-addons', 1);
	}

	matches(id) {
		return id.includes('three/examples/jsm');
	}
}

class ThreeCoreStrategy extends ChunkStrategy {
	constructor() {
		super('three-core', 2);
	}

	matches(id) {
		return id.includes('three') && !id.includes('three/examples/jsm');
	}
}

class VendorStrategy extends ChunkStrategy {
	constructor() {
		super('vendor', 3);
	}

	matches(id) {
		return id.includes('node_modules');
	}
}

const chunkManager = new ChunkManager().addStrategies(
	new ThreeAddonsStrategy(),
	new ThreeCoreStrategy(),
	new VendorStrategy(),
);

export { chunkManager };
