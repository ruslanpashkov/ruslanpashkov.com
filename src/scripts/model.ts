import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Typed from 'typed.js';
import { messages } from '@/constants/messages';
import { debounce } from '@/utils/performance';

const model = document.getElementById('model');
const message = document.getElementById('model-message');
const messageText = document.getElementById('model-message-text');
const percentage = document.getElementById('model-percentage');
const progress = document.getElementById('model-progress');
const progressBar = document.getElementById('model-progress-bar');
const loader = document.getElementById('model-loader');
const error = document.getElementById('model-error');

if (
	!model ||
	!message ||
	!messageText ||
	!percentage ||
	!progress ||
	!progressBar ||
	!loader ||
	!error
) {
	throw new Error('Required model elements not found');
}

type MessageCategory = keyof typeof messages;

const MODEL_PATH = '/models/stickman/scene.gltf';
const MEDIA_DARK = '(prefers-color-scheme: dark)';
const FADE_IN_DURATION_MS = 1000;
const INITIAL_MESSAGE_DELAY_MS = 1000;
const CLICK_COUNT_RESET_MS = 30000;
const READING_SPEED_MS_PER_CHAR = 80;
const MIN_MESSAGE_DISPLAY_MS = 3000;
const TYPING_SPEED_MS = 30;
const MESSAGE_TRANSITION_TIMEOUT_MS = 500;
const MODEL_SCALE = 0.8;
const MODEL_ROTATION_Y = -Math.PI / 12;
const LIGHT_THEME_COLOR = 0x553399;
const DARK_THEME_COLOR = 0xccff77;
const LIGHT_FOCUS_COLOR = 0xff66ff;
const DARK_FOCUS_COLOR = 0x00ffff;
const FOCUS_TRANSITION_DURATION_MS = 200;

const colorSchemeDark = document.getElementById('color-scheme-dark');
const darkMediaQuery = window.matchMedia(MEDIA_DARK);
const shownMessages = new Set<string>();

let isInteractive = false;
let clickCount = 0;
let lastClickTime = 0;

const getCurrentTheme = () => {
	const { colorScheme } = window.getComputedStyle(document.documentElement);
	return colorScheme === 'dark' ? 'dark' : 'light';
};

const getModelColor = () => (getCurrentTheme() === 'light' ? LIGHT_THEME_COLOR : DARK_THEME_COLOR);

const getFocusColor = () => (getCurrentTheme() === 'light' ? LIGHT_FOCUS_COLOR : DARK_FOCUS_COLOR);

const getRandomMessage = (category: MessageCategory) => {
	const categoryMessages = messages[category];
	const availableMessages = categoryMessages.filter((msg) => !shownMessages.has(msg));

	if (availableMessages.length === 0) {
		shownMessages.clear();
		availableMessages.push(...categoryMessages);
	}

	const selectedMessage =
		availableMessages[Math.floor(Math.random() * availableMessages.length)]!;
	shownMessages.add(selectedMessage);

	return selectedMessage;
};

const getMessageCategory = (count: number) => {
	const messageThresholds = [
		{ category: 'friendly' as const, threshold: 4 },
		{ category: 'cheeky' as const, threshold: 8 },
		{ category: 'sassy' as const, threshold: 12 },
		{ category: 'annoyed' as const, threshold: 16 },
		{ category: 'philosophical' as const, threshold: 20 },
	];
	const matchedThreshold = messageThresholds.find(({ threshold }) => count <= threshold);

	return matchedThreshold ? matchedThreshold.category : 'surrender';
};

const createScene = () => new THREE.Scene();

const createCamera = () => {
	const aspect = model.clientWidth / model.clientHeight;
	const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
	camera.position.set(0, 1, 3);
	return camera;
};

const createRenderer = () => {
	const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize(model.clientWidth, model.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0x000000, 0);
	model.appendChild(renderer.domElement);
	return renderer;
};

const createWireframeMaterial = () =>
	new THREE.MeshBasicMaterial({
		color: getModelColor(),
		opacity: 0,
		transparent: true,
		wireframe: true,
	});

const applyMaterialToMeshes = (object: THREE.Object3D, material: THREE.MeshBasicMaterial) => {
	object.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			child.material = material;
		}
	});
};

const createFadeInAnimation = (material: THREE.MeshBasicMaterial) => {
	const startTime = window.performance.now();

	const animate = (currentTime: number) => {
		const elapsed = currentTime - startTime;
		const animationProgress = Math.min(elapsed / FADE_IN_DURATION_MS, 1);
		const easeOutCubic = 1 - Math.pow(1 - animationProgress, 3);
		material.opacity = easeOutCubic;

		if (animationProgress < 1) {
			window.requestAnimationFrame(animate);
		}
	};

	material.opacity = 0;
	window.requestAnimationFrame(animate);
};

const showMessage = (msg: string, category: MessageCategory) => {
	isInteractive = false;
	message.classList.add('model-message--open');

	const typed = new Typed(messageText, {
		strings: [msg],
		typeSpeed: TYPING_SPEED_MS,
	});

	if (['annoyed', 'sassy', 'surrender'].includes(category)) {
		message.classList.add('model-message--shake');
	}

	const hideDelay = Math.max(MIN_MESSAGE_DISPLAY_MS, msg.length * READING_SPEED_MS_PER_CHAR);

	window.setTimeout(() => {
		message.classList.remove('model-message--open', 'model-message--shake');

		const cleanup = () => {
			typed.destroy();
			isInteractive = true;
		};

		const transitionDuration = getComputedStyle(message).transitionDuration;
		const hasTransition = transitionDuration !== '0s';

		if (hasTransition) {
			let cleaned = false;

			const safeCleanup = () => {
				if (!cleaned) {
					cleaned = true;
					cleanup();
				}
			};

			message.addEventListener('transitionend', safeCleanup, { once: true });
			window.setTimeout(safeCleanup, MESSAGE_TRANSITION_TIMEOUT_MS);
		} else {
			cleanup();
		}
	}, hideDelay);
};

const showInitialMessage = () => {
	window.setTimeout(() => {
		const initialMessage = getRandomMessage('initial');
		showMessage(initialMessage, 'friendly');
	}, INITIAL_MESSAGE_DELAY_MS);
};

const showErrorMessage = () => {
	error.classList.remove('model-notification--hidden');
};

const updateLoadingProgress = (percent: number) => {
	const loadingProgress = Math.min(100, Math.max(0, percent));
	progressBar.style.width = `${loadingProgress}%`;
	progress.setAttribute('aria-valuenow', loadingProgress.toString());
	percentage.textContent = `${Math.round(loadingProgress)}%`;
};

const hideLoader = () => {
	loader.setAttribute('aria-busy', 'false');
	loader.classList.add('model-notification--hidden');
	loader.addEventListener(
		'transitionend',
		() => {
			if (loader.parentNode) {
				loader.remove();
			}
		},
		{ once: true },
	);
};

const setupModelAnimation = (gltf: GLTF, root: THREE.Group) => {
	const firstAnimation = gltf.animations[0];

	if (firstAnimation) {
		const mixer = new THREE.AnimationMixer(root);
		mixer.clipAction(firstAnimation).play();
		return mixer;
	}

	return null;
};

const fitModelToContainer = (root: THREE.Group, camera: THREE.PerspectiveCamera) => {
	const box = new THREE.Box3().setFromObject(root);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());

	root.position.x = -center.x;
	root.position.y = -center.y;
	root.position.z = -center.z;
	root.rotation.y = MODEL_ROTATION_Y;

	const maxDim = Math.max(size.x, size.y, size.z);
	const fov = camera.fov * (Math.PI / 180);
	const distance = Math.abs(maxDim / Math.sin(fov / 2)) * MODEL_SCALE;

	camera.position.set(0, 0, distance);
	camera.lookAt(0, 0, 0);
	camera.updateProjectionMatrix();
};

const handleInteraction = () => {
	const currentTime = Date.now();

	if (currentTime - lastClickTime > CLICK_COUNT_RESET_MS) {
		clickCount = 0;
	}

	clickCount++;
	lastClickTime = currentTime;

	const category = getMessageCategory(clickCount);
	const randomMessage = getRandomMessage(category);
	showMessage(randomMessage, category);
};

const createFocusHandler = (material: THREE.MeshBasicMaterial) => {
	const baseColor = new THREE.Color(getModelColor());
	const focusColor = new THREE.Color(getFocusColor());
	const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	let animationId: number | null = null;
	let targetBlend = 0;
	let currentBlend = 0;

	const animateColor = () => {
		const diff = targetBlend - currentBlend;
		const step = (1 / FOCUS_TRANSITION_DURATION_MS) * 16;

		if (Math.abs(diff) > step) {
			currentBlend += Math.sign(diff) * step;
			material.color.copy(baseColor).lerp(focusColor, currentBlend);
			animationId = window.requestAnimationFrame(animateColor);
		} else {
			currentBlend = targetBlend;
			material.color.copy(baseColor).lerp(focusColor, currentBlend);
			animationId = null;
		}
	};

	const setFocused = (focused: boolean) => {
		targetBlend = focused ? 1 : 0;

		if (reducedMotionQuery.matches) {
			currentBlend = targetBlend;
			material.color.copy(baseColor).lerp(focusColor, currentBlend);
			return;
		}

		if (animationId === null) {
			animationId = window.requestAnimationFrame(animateColor);
		}
	};

	const updateColors = () => {
		baseColor.setHex(getModelColor());
		focusColor.setHex(getFocusColor());

		if (currentBlend === 0) {
			material.color.copy(baseColor);
		} else {
			material.color.copy(baseColor).lerp(focusColor, currentBlend);
		}
	};

	model.addEventListener('focus', () => setFocused(true));
	model.addEventListener('blur', () => setFocused(false));

	return { updateColors };
};

const setupModelInteraction = (root: THREE.Group, camera: THREE.PerspectiveCamera) => {
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	const updateMousePosition = (event: MouseEvent) => {
		const rect = model.getBoundingClientRect();
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
	};

	const isModelHit = () => {
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(root.children, true);
		return intersects.length > 0;
	};

	const onMouseDown = (event: MouseEvent) => {
		updateMousePosition(event);

		if (!isModelHit()) {
			event.preventDefault();
		}
	};

	const onMouseMove = (event: MouseEvent) => {
		updateMousePosition(event);
		model.style.cursor = isModelHit() ? 'pointer' : 'default';
	};

	const onClick = (event: MouseEvent) => {
		if (isInteractive) {
			updateMousePosition(event);

			if (isModelHit()) {
				handleInteraction();
			}
		}
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			handleInteraction();
		}
	};

	model.addEventListener('mousedown', onMouseDown);
	model.addEventListener('mousemove', debounce(onMouseMove));
	model.addEventListener('click', onClick);
	model.addEventListener('keydown', onKeyDown);
};

const loadGLTF = () => {
	const gltfLoader = new GLTFLoader();

	return new Promise<GLTF>((resolve, reject) => {
		gltfLoader.load(
			MODEL_PATH,
			resolve,
			(event) => {
				if (event.lengthComputable) {
					const percent = (event.loaded / event.total) * 100;
					updateLoadingProgress(percent);
				}
			},
			reject,
		);
	});
};

const setupLoadedModel = (gltf: GLTF, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
	const root = gltf.scene;
	const material = createWireframeMaterial();

	applyMaterialToMeshes(root, material);
	fitModelToContainer(root, camera);
	scene.add(root);

	const mixer = setupModelAnimation(gltf, root);
	const focusHandler = createFocusHandler(material);

	return { focusHandler, material, mixer, root };
};

const initializeModelInteractivity = (
	material: THREE.MeshBasicMaterial,
	root: THREE.Group,
	camera: THREE.PerspectiveCamera,
) => {
	createFadeInAnimation(material);
	setupModelInteraction(root, camera);
	showInitialMessage();
};

const createAnimationLoop = (
	renderer: THREE.WebGLRenderer,
	scene: THREE.Scene,
	camera: THREE.PerspectiveCamera,
	mixer: THREE.AnimationMixer | null,
) => {
	const clock = new THREE.Clock();

	const animate = () => {
		window.requestAnimationFrame(animate);
		const delta = clock.getDelta();

		if (mixer) {
			mixer.update(delta);
		}

		renderer.render(scene, camera);
	};

	animate();
};

const createThemeObserver = (focusHandler: { updateColors: () => void }) => {
	const updateColor = () => focusHandler.updateColors();

	if (colorSchemeDark) {
		new MutationObserver((mutations) => {
			const hasMediaChange = mutations.some(
				(mutation) => mutation.type === 'attributes' && mutation.attributeName === 'media',
			);

			if (hasMediaChange) {
				updateColor();
			}
		}).observe(colorSchemeDark, {
			attributeFilter: ['media'],
			attributes: true,
		});
	}

	darkMediaQuery.addEventListener('change', updateColor);
};

const createResizeHandler = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
	const onResize = () => {
		const width = model.clientWidth;
		const height = model.clientHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	};

	window.addEventListener('resize', debounce(onResize));
};

const init = async () => {
	try {
		updateLoadingProgress(0);

		const scene = createScene();
		const camera = createCamera();
		const renderer = createRenderer();

		const gltf = await loadGLTF();
		const { focusHandler, material, mixer, root } = setupLoadedModel(gltf, scene, camera);

		updateLoadingProgress(100);
		hideLoader();

		initializeModelInteractivity(material, root, camera);
		createAnimationLoop(renderer, scene, camera, mixer);
		createThemeObserver(focusHandler);
		createResizeHandler(camera, renderer);
	} catch (err) {
		console.error('Failed to initialize 3D model:', err);
		hideLoader();
		showErrorMessage();
	}
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
