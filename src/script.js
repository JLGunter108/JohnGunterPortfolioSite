import * as THREE from 'three'
import { DoubleSide } from 'three';

let previousShadowMap = false;

//debug

// loading
const textureLoader = new THREE.TextureLoader()

const divetTexture = textureLoader.load('textures/normal-divets.jpg')
const waterTexture = textureLoader.load('textures/water.jpg');
const roughTexture = textureLoader.load('textures/normal-pumice.jfif');

// Debug


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Objects
const geometry = new THREE.SphereGeometry( .5, 64, 64);
const sunGeometry = new THREE.SphereGeometry(.02,16,8);
const shadowBoxGeometry = new THREE.PlaneGeometry( 9,1.5 );

// Materials

const material = new THREE.MeshPhongMaterial({color: 0xffffff, envMap:divetTexture})
material.transparent = true;
material.blending = THREE.AdditiveBlending;
const sunMaterial = new THREE.MeshStandardMaterial( {
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0x000000
});
const shadowBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, normalMap: roughTexture});
shadowBoxMaterial.side = DoubleSide;

// Mesh
const sphere = new THREE.Mesh(geometry,material)
sphere.castShadow = true;
scene.add(sphere);
const shadowBox = new THREE.Mesh(shadowBoxGeometry, shadowBoxMaterial)
shadowBox.position.z = -1
shadowBox.receiveShadow = true;
scene.add(shadowBox);

// Lights

// const pointLight = new THREE.PointLight(0xff0000, 10)
// pointLight.position.set(10,-10,5)
// scene.add(pointLight)

// const pointLight2 = new THREE.PointLight(0xffffff, 10)
// pointLight2.position.set(-19.14,0.71,-20)
// scene.add(pointLight2)

const sunLight = new THREE.PointLight(0xffeeee, 7, 100, 2);
sunLight.add( new THREE.Mesh(sunGeometry,sunMaterial));
sunLight.position.set(2.5, 0, -0.2);
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
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Base camera
const camera = new THREE.PerspectiveCamera(95, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0,2.5)
scene.add(camera);


// Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));




/**
 * Animate
 */

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', onDocumentMouseMove)

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = ( event.clientX - windowX ) / 5000;
    mouseY = ( event.clientY - windowY ) / 1000;
}

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt(scene.position)
    // Update objects
    sphere.rotation.y = .2 * elapsedTime
    sunLight.rotateY(-0.008);
    sunLightObj.rotateY(-0.008);
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


}

tick()