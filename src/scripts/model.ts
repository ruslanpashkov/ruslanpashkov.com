import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Typed from 'typed.js';
import { messages } from '@/constants/messages';
import { debounce } from '@/utils/performance';

const model = document.getElementById('model');
const message = document.getElementById('model-message');
const messageText = document.getElementById('model-message-text');
const messageAnnouncement = document.getElementById('model-message-announcement');
const percentage = document.getElementById('model-percentage');
const progress = document.getElementById('model-progress');
const progressBar = document.getElementById('model-progress-bar');
const loader = document.getElementById('model-loader');
const error = document.getElementById('model-error');

if (
	!model ||
	!message ||
	!messageText ||
	!messageAnnouncement ||
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

const colorSchemeDark = document.getElementById('color-scheme-dark');
const shownMessages = new Set<string>();

let isInteractive = false;
let clickCount = 0;
let lastClickTime = 0;

const isDarkTheme = () => {
	if (!colorSchemeDark) {
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	const media = colorSchemeDark.getAttribute('media');

	if (media === 'all') {
		return true;
	}

	if (media === 'not all') {
		return false;
	}

	return window.matchMedia(media || '(prefers-color-scheme: dark)').matches;
};

const getModelColor = () => (isDarkTheme() ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);

const getRandomMessage = (category: MessageCategory) => {
	const categoryMessages = messages[category];
	const availableMessages = categoryMessages.filter((content) => !shownMessages.has(content));

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

const createRenderer = () => {
	const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
	const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
	renderer.setSize(model.clientWidth, model.clientHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

const showMessage = (content: string, category: MessageCategory) => {
	isInteractive = false;
	message.classList.add('model-message--open');
	messageAnnouncement.textContent = content;

	const typed = new Typed(messageText, {
		strings: [content],
		typeSpeed: TYPING_SPEED_MS,
	});

	if (['annoyed', 'sassy', 'surrender'].includes(category)) {
		message.classList.add('model-message--shake');
	}

	const hideDelay = Math.max(MIN_MESSAGE_DISPLAY_MS, content.length * READING_SPEED_MS_PER_CHAR);

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

	return { material, mixer };
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

const createThemeObserver = (material: THREE.MeshBasicMaterial) => {
	const updateColor = () => material.color.setHex(getModelColor());

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

const onModelClick = () => {
	if (isInteractive) {
		handleInteraction();
	}
};

const init = async () => {
	try {
		updateLoadingProgress(0);

		const scene = new THREE.Scene();
		const aspect = model.clientWidth / model.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
		const renderer = createRenderer();

		const gltf = await loadGLTF();
		const { material, mixer } = setupLoadedModel(gltf, scene, camera);

		updateLoadingProgress(100);
		hideLoader();

		createFadeInAnimation(material);
		showInitialMessage();
		createAnimationLoop(renderer, scene, camera, mixer);
		createThemeObserver(material);
		createResizeHandler(camera, renderer);

		model.addEventListener('click', onModelClick);
	} catch (error) {
		console.error('Failed to initialize 3D model:', error);
		hideLoader();
		showErrorMessage();
	}
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
