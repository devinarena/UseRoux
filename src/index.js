import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Cube from './cube';
import * as state from './cubestates';
import { setupUINavigation } from './statehandler';

// Cube-X

/**
 * @file: index.js
 * @author: Devin Arena
 * @since 10/15/2021
 * @description Entry point for the application, handles bulk of the
 *              logic for Three.js scenes and camera.
 */

// initialize camera and scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

let cube;

// Use a pivot so we can rotate the entire cube
const pivot = new THREE.Group();

// initialize renderer and camera controller
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

const threeContainer = document.body.getElementsByClassName("three-container")[0];

const init = () => {
    // add the cube pivot to the scene
    scene.add(pivot);

    // set renderer size and add it to the DOM
    renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight, false);
    threeContainer.appendChild(renderer.domElement);

    // default camera position
    camera.position.set(0, 0, 7);
    // disable panning for controls
    controls.enablePan = false;

    updateCanvasSize(true);

    state.init();

    // initialize the starting cube by creating 27 cubies
    cube = new Cube();
    cube.setupCube(pivot);

    // update the state to start as scrambled
    state.updateCube(cube, state.states.solved);

    // Init UI navigation, cube is solved too so we need access to the cube
    setupUINavigation(cube);
}

/**
 * Updates elements of the main scene.
 */
const animate = () => {

    updateCanvasSize(false);

    controls.update();
    cube.update(pivot);
    // pivot.rotateY(0.005);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

/**
 * Fixes the size of the canvas if its not properly sized. 
 * 
 * @param {boolean} force if we should update it even if the size is not computed as off
 */
const updateCanvasSize = (force) => {
    const canvas = renderer.domElement;

    // get current container size
    const width = threeContainer.clientWidth;
    const height = threeContainer.clientHeight;

    // if container size is not canvas size, window has resized, we need to fix it
    if (force || canvas.width !== width || canvas.height !== height) {
        // set the renderer size
        renderer.setSize(width, height, false);
        // update the camera so it looks the same
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

/**
 * Reset the camera when 'r' is pressed.
 */
document.addEventListener("keypress", evt => {
    if (evt.key ==='Esc') {
        controls.reset();
        camera.position.set(0, 0, 7);
    }
    // Rotate the cube if a move key is pressed
    if (evt.key === 'l' || evt.key === 'r' || evt.key === 'u' || 
        evt.key === 'd' || evt.key === 'f' || evt.key === 'b' ||
        evt.key === 'm' || evt.key === 'x' || evt.key === 'y' || 
        evt.key === 'z') {
        cube.rotate(pivot, evt.key, false);
    }
    // Capital letters are used for prime moves (in the opposite direction)
    if (evt.key === 'L' || evt.key === 'R' || evt.key === 'U' || 
        evt.key === 'D' || evt.key === 'F' || evt.key === 'B' ||
        evt.key === 'M' || evt.key === 'X' || evt.key === 'Y' || 
        evt.key === 'Z') {
        cube.rotate(pivot, evt.key.toLowerCase(), true);
    }

    if (evt.key === 'P') {
        cube.printState();
    }
});

/**
 * When the window first loads, begin animating the scene.
 */
window.onload = () => {
    init();
    animate();
}