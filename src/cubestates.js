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

import * as cubestates from './cubestate/cubestate.config';

/**
 * @file: cubestate.js
 * @author: Devin Arena
 * @since 10/16/2021
 * @description Contains logic for updating the state of the cube.
 */

let currentState;
const solveStages = [ "firstBlock", "secondBlock", "CMLL", "fourA", "fourB", "fourC" ];

const scrambleSelector = document.getElementById("scrambleChoice");

/**
 * Initializes the scramble selector.
 */
const init = () => {
    // add an option for all imported states
    for (const scramble of Object.keys(cubestates)) {
        scrambleSelector.innerHTML += "<option value=" + scramble + ">" + scramble + "</option>\n";
    }
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
    updateDialogs(state);
}

/**
 * Updates all the dialogs with new state strings from JSON.
 * 
 * @param {JSON} state the JSON state to read from
 */
const updateDialogs = (state) => {
    currentState = state;
    // Update any scrambles on the dialogs
    for (let dialogs of document.getElementsByClassName("guide-dialog")) {
        for (let scramble of dialogs.getElementsByClassName("scramble")) {
            scramble.innerHTML = currentState["scramble"];
        }
        if (solveStages.includes(dialogs.className.split(" ")[1])) {
            if (currentState.hasOwnProperty(dialogs.className.split(" ")[1]))
                dialogs.innerHTML += currentState[dialogs.className.split(" ")[1]]["extraText"];
        }
    }
}

export { init, updateCube, updateDialogs, cubestates, solveStages, currentState, scrambleSelector };