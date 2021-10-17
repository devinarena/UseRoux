// U2 B2 D' B R' D F' R U F2 L2 F2 L2 U2 F L2 B' U2 B' L2 U2

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

import scrambled from './cubestates/scrambled.json';
import solved from './cubestates/solved.json';

/**
 * @file: cubestate.js
 * @author: Devin Arena
 * @since 10/16/2021
 * @description Contains logic for updating the state of the cube.
 */

/**
 * Reads from a JSON file to update the cube.
 * 
 * @param {Array} cube the array of cubies to update
 * @param {JSON} state the JSON state to read from
 */
const updateCube = (cube, state) => {
    for (let i = 0; i < state["state"].length; i++) {
        let cubie = cube.cube[i];
        console.log(state["state"])
        for (let curr in state["state"][i]) {
            cubie.setColor(curr, state["state"][i][curr]);
        }
    }
}

export { updateCube, scrambled, solved };