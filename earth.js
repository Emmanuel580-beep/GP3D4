import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// =========================
// GP3D 3D EARTH
// =========================

const container = document.getElementById("earth-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// =========================
// TEXTURES
// =========================

const loader = new THREE.TextureLoader();

// IMPORTANT: These files must be inside images/
const earthTexture = loader.load(
  "./images/earth-day.jpg",
  () => console.log("Earth texture loaded"),
  undefined,
  (err) => console.error("Earth texture failed to load", err)
);

const cloudTexture = loader.load(
  "./images/clouds.png",
  () => console.log("Cloud texture loaded"),
  undefined,
  (err) => console.error("Cloud texture failed to load", err)
);

// =========================
// EARTH
// =========================

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(2, 128, 128),
  new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 20
  })
);

scene.add(earth);

// =========================
// CLOUDS
// =========================

const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(2.03, 128, 128),
  new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.35
  })
);

scene.add(clouds);

// =========================
// GLOW
// =========================

const glow = new THREE.Mesh(
  new THREE.SphereGeometry(2.12, 128, 128),
  new THREE.MeshBasicMaterial({
    color: 0x3ddc84,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide
  })
);

scene.add(glow);

// =========================
// STARS
// =========================

const starsGeometry = new THREE.BufferGeometry();
const starsVertices = [];

for (let i = 0; i < 2500; i++) {
  starsVertices.push(
    (Math.random() - 0.5) * 1000,
    (Math.random() - 0.5) * 1000,
    (Math.random() - 0.5) * 1000
  );
}

starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starsVertices, 3)
);

const stars = new THREE.Points(
  starsGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1
  })
);

scene.add(stars);

// =========================
// LIGHTS
// =========================

scene.add(new THREE.AmbientLight(0xffffff, 1.6));

const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(5, 3, 5);
scene.add(sun);

// =========================
// CONTROLS
// =========================

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;

// =========================
// ANIMATION
// =========================

function animate() {

  requestAnimationFrame(animate);

  earth.rotation.y += 0.001;
  clouds.rotation.y += 0.0015;

  controls.update();

  renderer.render(scene, camera);

}

animate();

// =========================
// RESPONSIVE
// =========================

window.addEventListener("resize", () => {

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

});