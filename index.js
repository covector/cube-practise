import * as THREE from 'https://cdn.skypack.dev/three@v0.130.1';

const info = {};
const randomIn = (min, max, dp = 0) => {
  const multiplicator = Math.pow(10, dp);
  return Math.round((Math.random() * (max - min) + min) * multiplicator) / multiplicator;
}

const scene = new THREE.Scene();

const fov = randomIn(40,110);
info.fov = fov;
const dist = 1.75 / Math.tan(fov / 2 * Math.PI / 180);
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const manager = new THREE.LoadingManager();
const updateTexture = (tex) => {
  cube.material.matcap = tex;
  renderer.render(scene, camera);
}
const texLoader = new THREE.TextureLoader(manager);
texLoader.load("./redwax.jpg", updateTexture);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshMatcapMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const randomRotation = () => {
  cube.rotation.x = randomIn(0, Math.PI, 2);
  cube.rotation.y = randomIn(0, Math.PI, 2);
  cube.rotation.z = randomIn(0, Math.PI, 2);
  info.rotation = { x: cube.rotation.x, y: cube.rotation.y, z: cube.rotation.z };
}
const randomDimension = () => {
  const min = 0.2;
  const max = 1.2;
  cube.scale.x = randomIn(min, max, 2);
  cube.scale.y = randomIn(min, max, 2);
  cube.scale.z = randomIn(min, max, 2);
  info.scale = { x: cube.scale.x, y: cube.scale.y, z: cube.scale.z };
}
randomRotation();
randomDimension();
console.log(info);

camera.position.y = dist;
camera.rotation.x = -Math.PI/2;

const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}
window.addEventListener('resize', resize);

const set = (fov, rotation, scale) => {
  camera.fov = fov;
  const newDist = 1.75 / Math.tan(fov / 2 * Math.PI / 180);
  camera.position.y = newDist;
  camera.updateProjectionMatrix();
  cube.rotation.x = rotation.x;
  cube.rotation.y = rotation.y;
  cube.rotation.z = rotation.z;
  cube.scale.x = scale.x;
  cube.scale.y = scale.y;
  cube.scale.z = scale.z;
  renderer.render(scene, camera);
}
window.set = set;

const reload = () => {
  randomRotation();
  randomDimension();
  const newFov = randomIn(40,110);
  camera.fov = newFov;
  const newDist = 1.75 / Math.tan(fov / 2 * Math.PI / 180);
  camera.position.y = newDist;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  console.log("Reloaded!");
  console.log(info);
}
window.reload = reload;