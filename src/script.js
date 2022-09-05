import * as THREE from 'three'
import * as dat from 'dat.gui'

let previousShadowMap = false;

//debug

const gui = new dat.GUI()

// loading
const textureLoader = new THREE.TextureLoader()

const divetTexture = textureLoader.load('textures/normal-divets.jpg')
const waterTexture = textureLoader.load('textures/water.jpg');

// Debug


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Objects
const geometry = new THREE.SphereGeometry( .5, 64, 64);
const sunGeometry = new THREE.SphereGeometry(.02,16,8);

// Materials

const material = new THREE.MeshStandardMaterial({color: 0x000fd0, normalMap:divetTexture})
const sunMaterial = new THREE.MeshStandardMaterial( {
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0x000000
});

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere);

// Lights

const pointLight = new THREE.PointLight(0xff0000, 10)
pointLight.position.set(-4.59,-30,-30)
scene.add(pointLight)

// const pointLight2 = new THREE.PointLight(0xffffff, 10)
// pointLight2.position.set(-19.14,0.71,-20)
// scene.add(pointLight2)

const sunLight = new THREE.PointLight(0xffeeee, 10, 100, 2);
sunLight.add( new THREE.Mesh(sunGeometry,sunMaterial));
sunLight.position.set(-1, .6, 0);
sunLight.castShadow = true;
const sunLightObj = new THREE.Object3D();
sunLightObj.add(sunLight);
scene.add(sunLightObj);


// Sizing
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)


// Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .2 * elapsedTime
    sunLight.rotateY(0.01);
    sunLightObj.rotateY(0.01);
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()