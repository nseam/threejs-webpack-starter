import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Materials

console.log (document.getElementById('ps').textContent);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}


const texMatrix = new THREE.Matrix4();
texMatrix.identity();

const material = new THREE.ShaderMaterial({
	uniforms: {
		time: { value: 1.0 },
		iterations: { value: 8.0 },
		cam_position: new THREE.Uniform(new THREE.Vector3(0, 0, -3)),
//		cam_direction: new THREE.Uniform(cam_direction),
		light_direction: new THREE.Uniform(new THREE.Vector3(-0.5, 0.3, -0.7)),
		lightNormal: new THREE.Uniform(new THREE.Vector3(0.2, -0.2, -0.7)),
		screen_ratio: { value: sizes.width / sizes.height },
		reflection_bounces: { value: 4 },
		texMatrix: new THREE.Uniform(texMatrix),
		cut_position: { value: -2 },
		cut_direction: new THREE.Uniform(new THREE.Vector3(0, 0, -1)),
	},
	vertexShader: document.getElementById('vs').textContent,
	fragmentShader: document.getElementById('ps').textContent,
})
material.color = new THREE.Color(0xFFFFFF)

const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
scene.add(new THREE.Mesh(geometry, material));

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.0001, 10000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
	antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const cam_position = new THREE.Vector3(0, 0, -3);
const cam_direction = new THREE.Matrix4();
cam_direction.identity();

let yaw = 0;
let distance = 9;

let last_time = (new Date()).getMilliseconds();

const tick = () =>
{
	const elapsedTime = clock.getElapsedTime()

	yaw = elapsedTime / 1;

    controls.update()



    const cameraRotationQuaternion = new THREE.Quaternion();
		cameraRotationQuaternion.setFromEuler(new THREE.Euler(1.5, yaw, 0));

		const cameraSourcePosition = new THREE.Vector3(0, 0, -distance);
		cameraSourcePosition.applyQuaternion(cameraRotationQuaternion);

		cam_direction.makeRotationFromQuaternion(cameraRotationQuaternion);

		material.uniforms.cam_position = new THREE.Uniform(cameraSourcePosition);
		material.uniforms.cam_direction = new THREE.Uniform(cam_direction);

		material.uniforms.screen_ratio =  { value: sizes.width / sizes.height };
		material.uniforms.time = { value: 0 };

    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
