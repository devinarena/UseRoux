/*
    {
        "left": "black",
        "right": "black",
        "top": "black",
        "bottom": "black",
        "front": "black",
        "back": "black"
    }
*/

import scrambled from './cubestates/10-18-2021.json';

/**
 * @file: cubestate.js
 * @author: Devin Arena
 * @since 10/16/2021
 * @description Contains logic for updating the state of the cube.
 */

let currentState;
const solveStages = [ "firstBlock", "secondBlock", "CMLL", "fourA", "fourB", "fourC" ];

const scrambles = "./cubestates";

const scrambleSelector = document.getElementById("scrambleSelector");

/**
 * Initializes the scramble selector.
 */
const init = () => {
}

/**
 * Reads from a JSON file to update the cube.
 * 
 * @param {Array} cube the array of cubies to update
 * @param {JSON} state the JSON state to read from
 */
const updateCube = (cube, state) => {
    currentState = state;
    for (let i = 0; i < state["state"].length; i++) {
        let cubie = cube.cube[i];
        // change each face on the cubie based on the state JSON
        for (let curr in state["state"][i]) {
            cubie.setColor(curr, state["state"][i][curr]);
        }
    }
    // Update any scrambles on the dialogs
    for (let dialogs of document.getElementsByClassName("guide-dialog")) {
        for (let scramble of dialogs.getElementsByClassName("scramble")) {
            scramble.innerHTML = state["scramble"];
        }
        if (solveStages.includes(dialogs.className.split(" ")[1])) {
            dialogs.innerHTML += state[dialogs.className.split(" ")[1]]["extraText"];
        }
    }
}

export { init, updateCube, scrambled, solveStages, currentState };