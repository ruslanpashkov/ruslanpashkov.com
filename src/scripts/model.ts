import * as THREE from 'three';
import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const getRefs = () => ({
	heroModel: document.getElementById('hero-model') as HTMLElement,
});

let refs: ReturnType<typeof getRefs>;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let model: THREE.Group;
let mixer: THREE.AnimationMixer;
let clock: THREE.Clock;
let currentMaterial: THREE.MeshBasicMaterial;
let themeObserver: MutationObserver;

const hasRefs = (references: typeof refs) => Object.values(references).every(Boolean);

const createScene = () => {
	scene = new THREE.Scene();
	clock = new THREE.Clock();
};

const createCamera = () => {
	const aspect = refs.heroModel.clientWidth / refs.heroModel.clientHeight;

	camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
	camera.position.set(0, 1, 3);
};

const createRenderer = () => {
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

	renderer.setSize(refs.heroModel.clientWidth, refs.heroModel.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setClearColor(0x000000, 0);

	refs.heroModel.appendChild(renderer.domElement);
};

const createControls = () => {
	controls = new OrbitControls(camera, renderer.domElement);

	controls.enableRotate = true;
	controls.minPolarAngle = Math.PI / 2;
	controls.maxPolarAngle = Math.PI / 2;
	controls.minAzimuthAngle = -Infinity;
	controls.maxAzimuthAngle = Infinity;
	controls.enableZoom = false;
	controls.enablePan = false;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
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

const getCurrentTheme = () => {
	return document.documentElement.getAttribute('data-theme');
};

const getThemeColor = () => {
	const theme = getCurrentTheme();

	return theme === 'light' ? 0x553399 : 0xccff77;
};

const createMaterial = () => {
	currentMaterial = new THREE.MeshBasicMaterial({
		color: getThemeColor(),
		wireframe: true,
	});

	return currentMaterial;
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

const setupAnimation = (gltf: GLTF) => {
	if (gltf.animations && gltf.animations.length > 0) {
		mixer = new THREE.AnimationMixer(model);
		mixer.clipAction(gltf.animations[0]).play();
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
		},
		(xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
		(error) => console.error(error),
	);
};

const animate = () => {
	if (clock) {
		const delta = clock.getDelta();

		if (mixer) {
			mixer.update(delta);
		}

		if (controls) {
			controls.update();
		}

		renderer.render(scene, camera);
	}
};

const handleResize = () => {
	if (camera && renderer) {
		const width = refs.heroModel.clientWidth;
		const height = refs.heroModel.clientHeight;

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
			createScene();
			createCamera();
			createRenderer();
			createControls();
			createLighting();

			await loadModel();

			initEventListeners();
			animate();
		} catch (error) {
			console.error('Error initializing 3D model:', error);
		}
	}
};

document.addEventListener('astro:page-load', init);

export { init };
