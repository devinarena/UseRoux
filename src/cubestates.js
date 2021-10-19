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

import solved from './cubestates/solved.json';
import scrambled from './cubestates/10-17-2021.json';
import todays from "./cubestates/10-18-2021.json";

/**
 * @file: cubestate.js
 * @author: Devin Arena
 * @since 10/16/2021
 * @description Contains logic for updating the state of the cube.
 */

let currentState;
const solveStages = [ "firstBlock", "secondBlock", "CMLL", "fourA", "fourB", "fourC" ];

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
}

export { updateCube, scrambled, solved, todays, solveStages, currentState };