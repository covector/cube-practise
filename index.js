import * as THREE from 'https://cdn.skypack.dev/three@v0.130.1';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const manager = new THREE.LoadingManager();
const updateTexture = (tex) => {
  cube.material.matcap = tex;
  renderer.render( scene, camera );
}
const texLoader = new THREE.TextureLoader(manager);
texLoader.load("./redwax.jpg", updateTexture);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshMatcapMaterial();
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const randomRotation = () => {
  cube.rotation.x = Math.random() * Math.PI;
  cube.rotation.y = Math.random() * Math.PI;
  cube.rotation.z = Math.random() * Math.PI;
}
const randomDimension = () => {
  const min = 0.2;
  cube.scale.x = min + Math.random() * (1.5 - min);
  cube.scale.y = min + Math.random() * (1.5 - min);
  cube.scale.z = min + Math.random() * (1.5 - min);
}
randomRotation();
randomDimension();

camera.position.y = 2.5;
camera.rotation.x = -Math.PI/2;

const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render( scene, camera );
}
window.addEventListener('resize', resize);