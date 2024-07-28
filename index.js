import * as THREE from 'https://cdn.skypack.dev/three@v0.130.1';

const info = {};
const randomIn = (min, max, dp = 0) => {
  const multiplicator = Math.pow(10, dp);
  return Math.round((Math.random() * (max - min) + min) * multiplicator) / multiplicator;
}

const scene = new THREE.Scene();

const predefinedFov = parseInt(document.URL.match(/(?<=[\?\&]fov=)[0-9]+/));
const fov = isNaN(predefinedFov) ? randomIn(40,110) : predefinedFov;
info.fov = fov;
const dist = 1.75 / Math.tan(fov / 2 * Math.PI / 180);
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);

let scaleFactor = parseFloat(document.URL.match(/(?<=[\?\&]scale=)[0-9\.]+/));
scaleFactor = isNaN(scaleFactor) || scaleFactor <= 0 ? 1 : scaleFactor;
camera.zoom = scaleFactor;
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const matMaterial = new THREE.MeshMatcapMaterial();
const wirMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const manager = new THREE.LoadingManager();
const updateTexture = (tex) => {
  matMaterial.matcap = tex;
  renderer.render(scene, camera);
}
const texLoader = new THREE.TextureLoader(manager);
texLoader.load("./redwax.jpg", updateTexture);

let wireframe = parseInt(document.URL.match(/(?<=[\?\&]w=)[0-9]+/));;
const toggleWireframe = () => {
  wireframe = !wireframe;
  cube.material = wireframe ? wirMaterial : matMaterial;
  renderer.render(scene, camera);
}
window.toggleWireframe = toggleWireframe;

window.addEventListener('touchstart', handleTouchStart, false);        
window.addEventListener('touchmove', handleTouchMove, false);
let xDown = null;
function handleTouchStart(e) {
  if (e.touches.length == 1) {
    const firstTouch = (e.touches || e.originalEvent.touches)[0];
    xDown = firstTouch.clientX;
  }
  if (e.touches.length == 2) {
    toggleWireframe();
  }
};                                                                                                                  
function handleTouchMove(e) {
  if (e.touches.length == 1 && xDown && Math.abs(xDown - e.touches[0].clientX) > 5) {
    reload();
  }
  xDown = null;
};

// cube, cuboid, cylinder, elliptic-cylinder
let objType = document.URL.match(/(?<=[\?\&]type=)[a-z\-]+/);
if (!objType) {
  objType = "cube";
}
if (objType != "cube" && objType != "cuboid" && objType != "cylinder" && objType != "elliptic-cylinder") {
  alert("Invalid object type! Supported types: (cube, cuboid, cylinder, elliptic-cylinder)");
  objType = "cube";
}
let geometry = objType == "cube" || objType == "cuboid" ? new THREE.BoxGeometry(1, 1, 1) : new THREE.CylinderGeometry(0.5, 0.5, 1, 64, 1);
const cube = new THREE.Mesh(geometry, matMaterial);
scene.add(cube);

const randomRotation = () => {
  cube.rotation.x = randomIn(0, Math.PI, 2);
  cube.rotation.y = randomIn(0, Math.PI, 2);
  cube.rotation.z = randomIn(0, Math.PI, 2);
  info.rotation = { x: cube.rotation.x, y: cube.rotation.y, z: cube.rotation.z };
}
const randomDimension = (xzSync = false) => {
  const min = 0.2;
  const max = 1.2;
  cube.scale.x = randomIn(min, max, 2);
  cube.scale.y = randomIn(min, max, 2);
  cube.scale.z = xzSync ? cube.scale.x : randomIn(min, max, 2);
  info.scale = { x: cube.scale.x * scaleFactor, y: cube.scale.y * scaleFactor, z: cube.scale.z * scaleFactor };
}
randomRotation();
if (objType != "cube") {
  randomDimension(objType == "cylinder");
}
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

const set = (newFov, rotation, scale = {x: 1, y: 1, z: 1}) => {
  camera.fov = newFov;
  const newDist = 1.75 / Math.tan(newFov / 2 * Math.PI / 180);
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
  if (objType != "cube") {
    randomDimension(objType == "cylinder");
  }
  const predefinedFov = parseInt(document.URL.match(/(?<=[\?\&]fov=)[0-9]+/));
  const newFov = isNaN(predefinedFov) ? randomIn(40,110) : predefinedFov;
  camera.fov = newFov;
  const newDist = 1.75 / Math.tan(newFov / 2 * Math.PI / 180);
  camera.position.y = newDist;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  console.log("Reloaded!");
  console.log(info);
}
window.reload = reload;

document.addEventListener('keydown', (event) => {
  if (event.key == "w") {
    toggleWireframe();
  } else if (event.key == "r") {
    reload();
  }
}, false);