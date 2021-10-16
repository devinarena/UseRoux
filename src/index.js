import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Cubie from './cubie';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let cube = [];

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

const init = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.set(0, 0, 8);

    // initialize the starting cube by creating 9 cubies
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                let cubie = new Cubie(i * 1.05, j * 1.05, k * 1.05);
                cube.push(cubie);
                scene.add(cubie.getCube());
            }
        }
    }

    // update the state to start as scrambled
}

/**
 * Updates elements of the main scene.
 */
const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

/**
 * When the window first loads, begin animating the scene.
 */
window.onload = () => {
    init();
    animate();
}