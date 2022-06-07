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

/**
 * @file: cubestate.js
 * @author: Devin Arena
 * @since 10/16/2021
 * @description Contains logic for updating the state of the cube.
 */

import Axios from "axios";
import solved from "./cubestate/solved.json";

const development = true;
const serverURL = development
  ? "http://localhost:5000"
  : "http://73.156.33.157:5000";

const dialogs = document.getElementsByClassName("guide-container")[0];

let solveID = 0;
let solutionData = {};
let steps = {};

/**
 * Initializes the page by grabbing the necessary data from the SQL server.
 * Generates the necessary HTML based on the steps for the given solve.
 */
const init = async () => {
  let urlParams = new URLSearchParams(location.search);
  solveID = urlParams.get("solve");

  if (!solveID) {
    dialogs.innerHTML = `<div class='guide-dialog'>
            <h1>No solve given</h1>
            <p>A solve was not given for the simulator, the simulator will not attempt to walk you through the solve. You can freely play with the cube.</p>
            <p>You can control the cube on the side using your keyboard. For example for an R move, type 'r', for an R' move, type 'shift+r'.</p>
            <p>X, Y, and Z can be used to rotate the cube.</p> 
        </div>`;
    return;
  }

  await Axios.get(`${serverURL}/api/solve`, {
    params: {
      _id: solveID,
    },
  }).then((response) => {
    // if (response.data.err) {
    //   window.location.href = "/simulator";
    // }
    console.log(response);
    solutionData = response.data;
  });

  const buttons = dialogs.getElementsByClassName("guide-buttons")[0];

  dialogs.innerHTML = `<div class='guide-dialog'>
            <h1>UseRoux</h1>
            <p>Welcome to the UseRoux cubing simulator! You'll be walking through an example solve.</p>
            <p>The cube on the left will follow the steps required to solve the cube. Try and follow along with these steps on your own cube.</p>
            <p>Use the buttons below to navigate the solve.</p>
        </div>`;

  let intro = "";

  intro += `<div class='guide-dialog scramble hidden'>
                          <h1>${solutionData.title}</h1>
                          <h3 class='italic'>${
                            solutionData.posted.split("T")[0]
                          }</h3>`;
  if (solutionData.description) intro += `<p>${solutionData.description}</p>`;
  intro += `<p>Scramble: ${solutionData.scramble}</p>
                      </div>`;

  dialogs.innerHTML += intro;

  for (const step of solutionData.steps) {
    dialogs.innerHTML += `<div class='guide-dialog step hidden'>
            <h1>${step.title}</h1>
            <p>${step.description}</p>
            <p>Moves: ${step.algorithm}</p>
          </div>`;
  }

  dialogs.innerHTML += buttons.outerHTML;
};

/**
 * Loads the solved state form solved.json onto the cube.
 *
 * @param {Cube} cube the cube to load
 */
const loadSolvedState = (cube) => {
  // grab each cubie
  for (let i = 0; i < solved["state"].length; i++) {
    let cubie = cube.cube[i];

    // set each color for each face
    for (let curr in solved["state"][i]) {
      cubie.setColor(curr, solved["state"][i][curr]);
    }
  }
};

export { init, loadSolvedState, solutionData };
