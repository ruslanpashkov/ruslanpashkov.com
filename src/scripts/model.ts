import * as THREE from 'three';
import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Typewriter from 'typewriter-effect/dist/core';

import type { MessageCategory } from '@/types/Message';

import { messages } from '@/constants/messages';

const getRefs = () => ({
	loader: document.getElementById('model-loader') as HTMLElement,
	message: document.getElementById('model-message') as HTMLElement,
	messageText: document.getElementById('model-message-text') as HTMLElement,
	model: document.getElementById('model') as HTMLElement,
	percentage: document.getElementById('model-percentage') as HTMLElement,
	progressBar: document.getElementById('model-progress-bar') as HTMLElement,
});

let refs: ReturnType<typeof getRefs>;
let animationId: number;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let model: THREE.Group;
let mixer: THREE.AnimationMixer;
let clock: THREE.Clock;
let currentMaterial: THREE.MeshBasicMaterial;
let themeObserver: MutationObserver;
let loadingProgress = 0;
let clickCount = 0;
let lastClickTime = 0;
let messageTimeout: number;
let isInitialized = false;
let isMessageOpen = false;
let modelMouseMoveHandler: ((event: MouseEvent) => void) | null = null;
let modelClickHandler: ((event: MouseEvent) => void) | null = null;

const shownMessages = new Set<string>();

const hasRefs = (references: typeof refs) => Object.values(references).every(Boolean);

const getCurrentTheme = () => {
	return document.documentElement.getAttribute('data-theme');
};

const getThemeColor = () => {
	const theme = getCurrentTheme();

	return theme === 'light' ? 0x553399 : 0xccff77;
};

const getRandomMessage = (category: MessageCategory) => {
	const categoryMessages = messages[category];
	const availableMessages = categoryMessages.filter((message) => !shownMessages.has(message));

	if (availableMessages.length === 0) {
		shownMessages.clear();
		availableMessages.push(...categoryMessages);
	}

	const selectedMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];

	shownMessages.add(selectedMessage);

	return selectedMessage;
};

const getMessageCategory = (count: number): MessageCategory => {
	const messageThresholds = [
		{ category: 'friendly' as const, threshold: 4 },
		{ category: 'cheeky' as const, threshold: 8 },
		{ category: 'sassy' as const, threshold: 12 },
		{ category: 'annoyed' as const, threshold: 16 },
		{ category: 'philosophical' as const, threshold: 20 },
	];

	const matchedThreshold = messageThresholds.find(({ threshold }) => count <= threshold);

	return matchedThreshold?.category ?? 'surrender';
};

const createScene = () => {
	scene = new THREE.Scene();
	clock = new THREE.Clock();
};

const createCamera = () => {
	const aspect = refs.model.clientWidth / refs.model.clientHeight;

	camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
	camera.position.set(0, 1, 3);
};

const createRenderer = () => {
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

	renderer.setSize(refs.model.clientWidth, refs.model.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setClearColor(0x000000, 0);

	refs.model.appendChild(renderer.domElement);
};

const createLighting = () => {
	const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

	directionalLight.position.set(10, 10, 5);
	directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.width = 2048;
	directionalLight.shadow.mapSize.height = 2048;

	scene.add(ambientLight);
	scene.add(directionalLight);
};

const createMaterial = () => {
	currentMaterial = new THREE.MeshBasicMaterial({
		color: getThemeColor(),
		wireframe: true,
	});

	return currentMaterial;
};

const writeMessage = (message: string) => {
	const typingSpeed = 30;

	const typewriter = new Typewriter(refs.messageText, {
		delay: typingSpeed,
	});

	typewriter.typeString(message).start();
};

const showMessage = (text: string, category: MessageCategory = 'friendly') => {
	if (refs.message && refs.messageText) {
		if (messageTimeout) {
			clearTimeout(messageTimeout);
		}

		refs.message.classList.add('message--open');
		isMessageOpen = true;
		writeMessage(text);

		if (['annoyed', 'sassy', 'surrender'].includes(category)) {
			refs.message.classList.add('message--shake');
		}

		const readingSpeed = 80;
		const hideDelay = Math.max(3000, text.length * readingSpeed);

		messageTimeout = window.setTimeout(() => {
			if (refs.message) {
				refs.message.classList.remove('message--open', 'message--shake');
				refs.message.addEventListener(
					'transitionend',
					() => {
						isMessageOpen = false;
					},
					{ once: true },
				);
			}
		}, hideDelay);
	}
};

const showInitialMessage = () => {
	if (!isInitialized && refs.message && refs.messageText) {
		setTimeout(() => {
			const message = getRandomMessage('initial');

			showMessage(message, 'friendly');
			isInitialized = true;
		}, 1000);
	}
};

const updateModelColor = () => {
	if (currentMaterial) {
		currentMaterial.color.setHex(getThemeColor());
	}
};

const applyWireframeMaterial = (object: THREE.Object3D) => {
	const wireframeMaterial = createMaterial();

	object.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			child.material = wireframeMaterial;
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
};

const fitModelToContainer = () => {
	if (model && camera) {
		const box = new THREE.Box3().setFromObject(model);
		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());

		model.position.x = -center.x;
		model.position.y = -center.y;
		model.position.z = -center.z;

		model.rotation.y = -Math.PI / 12;

		const maxDim = Math.max(size.x, size.y, size.z);

		const scale = 0.8;
		const fov = camera.fov * (Math.PI / 180);
		const distance = Math.abs(maxDim / Math.sin(fov / 2)) * scale;

		camera.position.set(0, 0, distance);
		camera.lookAt(0, 0, 0);

		camera.updateProjectionMatrix();
	}
};

const updateLoadingProgress = (progress: number) => {
	loadingProgress = Math.min(100, Math.max(0, progress));

	if (refs.progressBar) {
		refs.progressBar.style.width = `${loadingProgress}%`;
		refs.progressBar.parentElement!.setAttribute('aria-valuenow', loadingProgress.toString());
	}

	if (refs.percentage) {
		refs.percentage.textContent = `${Math.round(loadingProgress)}%`;
	}
};

const hideLoader = () => {
	if (refs.loader) {
		refs.loader.classList.add('model-loader--hidden');

		refs.loader.addEventListener(
			'transitionend',
			() => {
				if (refs.loader && refs.loader.parentNode) {
					refs.loader.remove();
				}
			},
			{ once: true },
		);
	}
};

const setupAnimation = (gltf: GLTF) => {
	if (gltf.animations && gltf.animations.length > 0) {
		mixer = new THREE.AnimationMixer(model);
		mixer.clipAction(gltf.animations[0]).play();
	}
};

const setupModelInteraction = () => {
	if (renderer && camera && model) {
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		const updateMousePosition = (event: MouseEvent) => {
			if (refs.model) {
				const rect = refs.model.getBoundingClientRect();

				mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
				mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
			}
		};

		modelMouseMoveHandler = (event: MouseEvent) => {
			if (refs.model && camera && scene && isInitialized) {
				updateMousePosition(event);
				raycaster.setFromCamera(mouse, camera);

				const intersects = raycaster.intersectObjects(model.children, true);

				if (intersects.length > 0) {
					refs.model.style.cursor = 'pointer';
				} else {
					refs.model.style.cursor = 'default';
				}
			}
		};

		modelClickHandler = (event: MouseEvent) => {
			if (refs.model && camera && scene && !isMessageOpen && isInitialized) {
				updateMousePosition(event);
				raycaster.setFromCamera(mouse, camera);

				const intersects = raycaster.intersectObjects(model.children, true);

				if (intersects.length > 0) {
					handleModelClick();
				}
			}
		};

		refs.model.addEventListener('mousemove', modelMouseMoveHandler);
		refs.model.addEventListener('click', modelClickHandler);
	}
};

const loadModel = async () => {
	const loader = new GLTFLoader();

	loader.load(
		'/models/stickman/scene.gltf',
		(gltf) => {
			model = gltf.scene;

			applyWireframeMaterial(model);
			setupAnimation(gltf);
			fitModelToContainer();

			scene.add(model);

			updateLoadingProgress(100);

			if (refs.model) {
				refs.model.classList.add('model--loaded');
			}

			hideLoader();
			setupModelInteraction();
			showInitialMessage();
		},
		(progress) => {
			if (progress.lengthComputable) {
				const percentComplete = (progress.loaded / progress.total) * 100;

				updateLoadingProgress(percentComplete);
			} else {
				loadingProgress += 10;
				updateLoadingProgress(loadingProgress);
			}
		},
		(error) => console.error('Error loading 3D model:', error),
	);
};

const animate = () => {
	if (clock) {
		animationId = requestAnimationFrame(animate);

		const delta = clock.getDelta();

		if (mixer) {
			mixer.update(delta);
		}

		renderer.render(scene, camera);
	}
};

const handleModelClick = () => {
	const currentTime = Date.now();

	if (currentTime - lastClickTime > 30000) {
		clickCount = 0;
	}

	clickCount++;
	lastClickTime = currentTime;

	const category = getMessageCategory(clickCount);
	const message = getRandomMessage(category);

	showMessage(message, category);
};

const handleResize = () => {
	if (camera && renderer) {
		const width = refs.model.clientWidth;
		const height = refs.model.clientHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}
};

const handleThemeChange = () => {
	updateModelColor();
};

const initEventListeners = () => {
	window.addEventListener('resize', handleResize);

	themeObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
				handleThemeChange();
			}
		});
	});

	themeObserver.observe(document.documentElement, {
		attributeFilter: ['data-theme'],
		attributes: true,
	});
};

const init = async () => {
	refs = getRefs();

	if (hasRefs(refs)) {
		try {
			updateLoadingProgress(0);

			createScene();
			createCamera();
			createRenderer();
			createLighting();

			await loadModel();

			initEventListeners();
			animate();
		} catch (error) {
			console.error('Error initializing 3D model:', error);

			if (refs.loader) {
				refs.loader.innerHTML =
					'<div class="model-loader__content"><div class="model-loader__text">Failed to initialize</div></div>';
				hideLoader();
			}
		}
	}
};

const cleanup = () => {
	if (animationId) {
		cancelAnimationFrame(animationId);
	}

	window.removeEventListener('resize', handleResize);

	if (themeObserver) {
		themeObserver.disconnect();
	}

	if (messageTimeout) {
		window.clearTimeout(messageTimeout);
	}

	if (modelMouseMoveHandler) {
		refs.model.removeEventListener('mousemove', modelMouseMoveHandler);
		modelMouseMoveHandler = null;
	}

	if (modelClickHandler) {
		refs.model.removeEventListener('click', modelClickHandler);
		modelClickHandler = null;
	}

	if (isInitialized) {
		isInitialized = false;
		isMessageOpen = false;
		clickCount = 0;
		lastClickTime = 0;
		shownMessages.clear();
	}

	if (mixer) {
		mixer.stopAllAction();
		mixer.uncacheRoot(mixer.getRoot());
	}

	if (scene) {
		scene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				if (object.geometry) {
					object.geometry.dispose();
				}

				if (object.material) {
					if (Array.isArray(object.material)) {
						object.material.forEach((material) => material.dispose());
					} else {
						object.material.dispose();
					}
				}
			}
		});

		while (scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}

		scene.clear();
	}

	if (currentMaterial) {
		currentMaterial.dispose();
	}

	if (renderer) {
		const canvas = renderer.domElement;

		if (canvas && canvas.parentNode) {
			canvas.parentNode.removeChild(canvas);
		}

		renderer.dispose();
	}
};

document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);

export { cleanup, init };
