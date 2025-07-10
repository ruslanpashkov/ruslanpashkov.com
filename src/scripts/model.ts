import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Typed from 'typed.js';
import { messages } from '@/constants/messages';
import { debounce } from '@/utils/performance';

(() => {
	const model = document.getElementById('model');
	const message = document.getElementById('model-message');
	const text = document.getElementById('model-message-text');
	const percentage = document.getElementById('model-percentage');
	const progress = document.getElementById('model-progress-bar');
	const loader = document.getElementById('model-loader');
	const error = document.getElementById('model-error');

	if (!model || !message || !text || !percentage || !progress || !loader || !error) {
		console.error('Required model elements not found');
		return;
	}

	type MessageCategory = keyof typeof messages;

	const shownMessages = new Set<string>();
	let isInteractive = false;

	const getCurrentTheme = () => document.documentElement.getAttribute('data-theme');

	const getModelColor = () => (getCurrentTheme() === 'light' ? 0x553399 : 0xccff77);

	const getRandomMessage = (category: MessageCategory) => {
		const categoryMessages = messages[category];
		const availableMessages = categoryMessages.filter((msg) => !shownMessages.has(msg));

		if (availableMessages.length === 0) {
			shownMessages.clear();
			availableMessages.push(...categoryMessages);
		}

		const selectedMessage =
			availableMessages[Math.floor(Math.random() * availableMessages.length)];
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

		if (matchedThreshold) {
			return matchedThreshold.category;
		}

		return 'surrender';
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
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setClearColor(0x000000, 0);
		model.appendChild(renderer.domElement);
		return renderer;
	};

	const createLighting = (scene: THREE.Scene) => {
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 10, 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		scene.add(ambientLight);
		scene.add(directionalLight);
	};

	const createMaterial = () =>
		new THREE.MeshBasicMaterial({
			color: getModelColor(),
			opacity: 0,
			transparent: true,
			wireframe: true,
		});

	const createFadeInAnimation = (material: THREE.MeshBasicMaterial) => {
		const startTime = performance.now();
		const duration = 1000;

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easeOutCubic = 1 - Math.pow(1 - progress, 3);
			material.opacity = easeOutCubic;

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};

		material.opacity = 0;
		requestAnimationFrame(animate);
	};

	const showMessage = (msg: string, category: MessageCategory) => {
		isInteractive = false;
		message.classList.add('model-message--open');

		const typed = new Typed(text, {
			strings: [msg],
			typeSpeed: 30,
		});

		if (['annoyed', 'sassy', 'surrender'].includes(category)) {
			message.classList.add('model-message--shake');
		}

		const readingSpeed = 80;
		const hideDelay = Math.max(3000, msg.length * readingSpeed);

		window.setTimeout(() => {
			message.classList.remove('model-message--open', 'model-message--shake');
			message.addEventListener(
				'transitionend',
				() => {
					typed.destroy();
					isInteractive = true;
				},
				{ once: true },
			);
		}, hideDelay);
	};

	const showInitialMessage = () => {
		window.setTimeout(() => {
			const text = getRandomMessage('initial');
			showMessage(text, 'friendly');
		}, 1000);
	};

	const showErrorMessage = () => {
		error.classList.remove('model-notification--hidden');
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

		return wireframeMaterial;
	};

	const fitModelToContainer = (root: THREE.Group, camera: THREE.PerspectiveCamera) => {
		const box = new THREE.Box3().setFromObject(root);
		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());
		root.position.x = -center.x;
		root.position.y = -center.y;
		root.position.z = -center.z;
		root.rotation.y = -Math.PI / 12;
		const maxDim = Math.max(size.x, size.y, size.z);
		const scale = 0.8;
		const fov = camera.fov * (Math.PI / 180);
		const distance = Math.abs(maxDim / Math.sin(fov / 2)) * scale;
		camera.position.set(0, 0, distance);
		camera.lookAt(0, 0, 0);
		camera.updateProjectionMatrix();
	};

	const updateLoadingProgress = (percent: number) => {
		const loadingProgress = Math.min(100, Math.max(0, percent));
		progress.style.width = `${loadingProgress}%`;
		progress.parentElement!.setAttribute('aria-valuenow', loadingProgress.toString());
		percentage.textContent = `${Math.round(loadingProgress)}%`;
	};

	const hideLoader = () => {
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

	const setupAnimation = (gltf: GLTF, root: THREE.Group) => {
		if (gltf.animations && gltf.animations.length > 0) {
			const mixer = new THREE.AnimationMixer(root);
			mixer.clipAction(gltf.animations[0]).play();
			return mixer;
		}

		return null;
	};

	const createModelInteraction = (root: THREE.Group, camera: THREE.PerspectiveCamera) => {
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		let clickCount = 0;
		let lastClickTime = 0;

		const handleClick = () => {
			const currentTime = Date.now();

			if (currentTime - lastClickTime > 30000) {
				clickCount = 0;
			}

			clickCount++;
			lastClickTime = currentTime;
			const category = getMessageCategory(clickCount);
			const text = getRandomMessage(category);
			showMessage(text, category);
		};

		const updateMousePosition = (event: MouseEvent) => {
			const rect = model.getBoundingClientRect();
			mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
		};

		const onMouseMove = (event: MouseEvent) => {
			updateMousePosition(event);
			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(root.children, true);
			model.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
		};

		const onClick = (event: MouseEvent) => {
			if (isInteractive) {
				updateMousePosition(event);
				raycaster.setFromCamera(mouse, camera);
				const intersects = raycaster.intersectObjects(root.children, true);

				if (intersects.length > 0) {
					handleClick();
				}
			}
		};

		model.addEventListener('mousemove', debounce(onMouseMove));
		model.addEventListener('click', onClick);
	};

	const loadModel = async (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
		const loader = new GLTFLoader();

		return new Promise<{
			material: THREE.MeshBasicMaterial;
			mixer: null | THREE.AnimationMixer;
			root: THREE.Group;
		}>((resolve, reject) => {
			loader.load(
				'/models/stickman/scene.gltf',
				(gltf) => {
					const root = gltf.scene;
					const material = applyWireframeMaterial(root);
					const mixer = setupAnimation(gltf, root);
					fitModelToContainer(root, camera);
					scene.add(root);
					updateLoadingProgress(100);
					hideLoader();
					createFadeInAnimation(material);
					createModelInteraction(root, camera);
					showInitialMessage();
					resolve({ material, mixer, root });
				},
				(progress) => {
					if (progress.lengthComputable) {
						const percentComplete = (progress.loaded / progress.total) * 100;
						updateLoadingProgress(percentComplete);
					} else {
						updateLoadingProgress(Math.min(100, Math.random() * 10 + 90));
					}
				},
				(error) => {
					hideLoader();
					showErrorMessage();
					reject(error);
				},
			);
		});
	};

	const createAnimationLoop = (
		renderer: THREE.WebGLRenderer,
		scene: THREE.Scene,
		camera: THREE.PerspectiveCamera,
		mixer: null | THREE.AnimationMixer,
	) => {
		const clock = new THREE.Clock();

		const animate = () => {
			requestAnimationFrame(animate);
			const delta = clock.getDelta();

			if (mixer) {
				mixer.update(delta);
			}

			renderer.render(scene, camera);
		};

		animate();
	};

	const createThemeObserver = (material: THREE.MeshBasicMaterial) => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
					material.color.setHex(getModelColor());
				}
			});
		});

		observer.observe(document.documentElement, {
			attributeFilter: ['data-theme'],
			attributes: true,
		});
	};

	const createResizeHandler = (
		camera: THREE.PerspectiveCamera,
		renderer: THREE.WebGLRenderer,
	) => {
		const onResize = () => {
			const width = model.clientWidth;
			const height = model.clientHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		};

		window.addEventListener('resize', onResize);
	};

	const init = async () => {
		try {
			updateLoadingProgress(0);
			const scene = createScene();
			const camera = createCamera();
			const renderer = createRenderer();
			const { material, mixer } = await loadModel(scene, camera);
			createLighting(scene);
			createAnimationLoop(renderer, scene, camera, mixer);
			createThemeObserver(material);
			createResizeHandler(camera, renderer);
		} catch {
			hideLoader();
			showErrorMessage();
		}
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
