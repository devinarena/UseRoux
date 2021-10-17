import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Cube from './cube';
import * as state from './cubestates';

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

let firstBlock = "Z' Y' U M' L' U L2 U' L' R' U' R U2 B";
let secondBlock = "U' M' U R U' R M R U' R' M R' U R";
let cmll = "U R' U' R' F R F' R U' R' U2 R";
let fourA = "M U' M' U' M";
let fourB = "U' M' U2 M U M2 U'";
let fourC = "M U2 M U2";


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

    // initialize the starting cube by creating 27 cubies
    cube = new Cube();
    cube.setupCube(pivot);

    // update the state to start as scrambled
    state.updateCube(cube, state.scrambled);

    cube.queueMoves(state.scrambled["firstBlock"]["algorithm"]);
    cube.queueMoves(state.scrambled["secondBlock"]["algorithm"]);
    cube.queueMoves(state.scrambled["CMLL"]["algorithm"]);
    cube.queueMoves(state.scrambled["fourA"]["algorithm"]);
    cube.queueMoves(state.scrambled["fourB"]["algorithm"]);
    cube.queueMoves(state.scrambled["fourC"]["algorithm"]);
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

    const width = threeContainer.clientWidth;
    const height = threeContainer.clientHeight;

    if (force || canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
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
});

/**
 * When the window first loads, begin animating the scene.
 */
window.onload = () => {
    init();
    animate();
}