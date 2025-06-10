/// <reference path="../.astro/types.d.ts" />

// https://github.com/tameemsafi/typewriterjs/issues/144
declare module 'typewriter-effect/dist/core' {
	const Typewriter: typeof import('typewriter-effect').TypewriterClass;
	export default Typewriter;
}
