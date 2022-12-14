import * as THREE from 'three'
import { BackSide, DoubleSide, MeshStandardMaterial } from 'three';
import { Vector3, VectorKeyframeTrack } from 'three';


// loading
const textureLoader = new THREE.TextureLoader()

const divetTexture = textureLoader.load('textures/normal-divets.jpg')
const waterTexture = textureLoader.load('textures/water.jpg');
const roughTexture = textureLoader.load('textures/normal-pumice.jfif');
const fogTexture = textureLoader.load('textures/realistic-fog.jpg');

const satelites = [];

// Canvas

const canvas = document.querySelector('canvas.webgl')

// Scene

const scene = new THREE.Scene()
scene.background = fogTexture;

// Objects
const geometry = new THREE.SphereGeometry( .000000001, 64, 64);
const sunGeometry = new THREE.SphereGeometry(.02,16,8);
const shadowBoxGeometry = new THREE.CircleGeometry(6, 64,  );


// Materials

const material = new THREE.MeshStandardMaterial()
material.side = BackSide;
material.transparent = true;
material.blending = THREE.AdditiveBlending;
const randMaterial = new MeshStandardMaterial({color: 0x808080, normalMap: divetTexture})
const sunMaterial = new THREE.MeshStandardMaterial( {
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0xffffff
});
const shadowBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, normalMap: roughTexture});
shadowBoxMaterial.side = DoubleSide;

// Mesh

const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere);
const shadowBox = new THREE.Mesh(shadowBoxGeometry, shadowBoxMaterial)
shadowBox.position.z = -3
shadowBox.receiveShadow = true;
scene.add(shadowBox);

for ( let i = 0; i < 100; i ++ ) {

    const randGeometry = new THREE.SphereGeometry(Math.random()*.02, 64, 64)
    const randMesh = new THREE.Mesh( randGeometry, randMaterial );
    randMesh.castShadow = true;
    randMesh.position.x = Math.random()*(3+3) - 3;
    randMesh.position.y = Math.random()*(3+3) - 3;
    randMesh.position.z = Math.random()*(3+3) - 3;
    randMesh.scale.x = randMesh.scale.y = randMesh.scale.z = Math.random() * 3 + 1;

    sphere.add( randMesh );
    satelites.push( randMesh );
}

// Lights

// const pointLight = new THREE.PointLight(0x000000, 3)
// pointLight.position.set(0,0,0)
// scene.add(pointLight);

// const pointLight2 = new THREE.PointLight(0xffffff, 10)
// pointLight2.position.set(-19.14,0.71,-20)
// scene.add(pointLight2)

const sunLight = new THREE.PointLight(0xc0c0c0, 19, 7, 3);
sunLight.add( new THREE.Mesh(sunGeometry,sunMaterial));
sunLight.position.set(2.5, 0, -0.2);
sunLight.castShadow = true;
const sunLightObj = new THREE.Object3D();
sunLightObj.add(sunLight);
scene.add(sunLightObj);

scene.add(new THREE.AmbientLight(0xf7ca16, .01, 1));
// Sizing

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

// Base camera

const camera = new THREE.PerspectiveCamera(95, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0,3)
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

// Animation

const speed = [ 0.008, 0.006, 0.004]

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', onDocumentMouseMove);

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = ( event.clientX - windowX ) / 5000;
    mouseY = ( event.clientY - windowY ) / 1000;
}

const tick = () =>{

    camera.position.x += ( mouseX - camera.position.x ) * .1;
    camera.position.y += ( - mouseY - camera.position.y ) * .1;
    camera.lookAt(scene.position);
    // sphere.rotateY(Math.random()*(0.001-0.008)+0.008);
    // sphere.rotateX(Math.random()*(0.0007-0.001)+0.001);
    sphere.rotateX(.0009);
    sphere.rotateY(Math.random()*0.0009);
    sunLight.rotateY(-0.008);
    sunLightObj.rotateY(-0.008);
    sunLight.rotateX(-.0002)
    sunLightObj.rotateX(-.002)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()

// document.addEventListener('click', onDocumentMouseClick);

// function onDocumentMouseClick(event) {
    
// }

const slidesContainer = document.getElementById("slides-container");
const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");

nextButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft += slideWidth;
});

prevButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft -= slideWidth;
});
