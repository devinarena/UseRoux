/**
 * @file: statehandler.js
 * @author: Devin Arena
 * @since 10/17/2021
 * @description Manages changing pages, e.g. going from intro to first block. Updates
 *              HTML elements and handles animations.
 */

import { solveStages, currentState } from "./cubestates";

const dialogContainer = document.getElementsByClassName("guide-container")[0];
const dialogs = dialogContainer.getElementsByClassName("guide-dialog");

let currPage = 0;

/**
 * Moves to the next page when the next button is pressed.
 * 
 * @param {Cube} cube the cube to update when pages are changed.
 */
const nextPage = (cube) => {
    // if we're at the last page or the cube is currently rotating, we can't change the page
    if (currPage === dialogs.length - 1 || cube.inProgress())
        return;
    // move to the next page
    currPage++;
    for (let i = 0; i < dialogs.length; i++) {
        // shows the current dialog and hides the previous by appending to the class name
        if (currPage === i) {
            setTimeout(() => {
                dialogs[i].className = dialogs[i].className.substring(0, dialogs[i].className.length - 7);
                dialogs[i].style.opacity = 1;
            }, 1000);
        } else if (currPage - 1 === i) {
            dialogs[i].style.opacity = 0;
            setTimeout(() => {
                dialogs[i].className += " hidden";
            }, 1000);
        }
    }
    // queue moves to get into this state
    if (solveStages.includes(dialogs[currPage].className.split(" ")[1])) {
        let algorithm = currentState[dialogs[currPage].className.split(" ")[1]]["algorithm"];
        for (let element of dialogs[currPage].getElementsByClassName("algorithm")) {
            element.innerHTML = algorithm;
        }
        cube.queueMoves(algorithm);
    }
}

/**
 * Moves to the previous page when the previous button is pressed.
 * 
 * @param {Cube} cube the cube to update when pages are changed.
 */
const prevPage = (cube) => {
    // if we're at the first page or the cube is currently rotating, we can't change the page
    if (currPage === 0 || cube.inProgress())
        return;
    // moves to the previous page
    currPage--;
    for (let i = 0; i < dialogs.length; i++) {
        // shows the current dialog and hides the previous by appending to the class name
        if (currPage === i) {
            setTimeout(() => {
                dialogs[i].className = dialogs[i].className.substring(0, dialogs[i].className.length - 7);
                dialogs[i].style.opacity = 1;
            }, 1000);
        } else if (currPage + 1 === i) {
            dialogs[i].style.opacity = 0;
            setTimeout(() => {
                dialogs[i].className += " hidden";
            }, 1000);
        }
    }
    // queue reversed moves to get back into this state
    if (solveStages.includes(dialogs[currPage].className.split(" ")[1]))
        cube.queueMovesReversed(currentState[dialogs[currPage].className.split(" ")[1]]["algorithm"]);
}

/**
 * Sets up navigation elements with their respective event listeners.
 */
const setupUINavigation = (cube) => {
    document.getElementById("nextButton").onclick = () => nextPage(cube);
    document.getElementById("prevButton").onclick = () => prevPage(cube);
    for (let i = 1; i < dialogs.length; i++)
        dialogs[i].style.opacity = 0;
}

export { setupUINavigation };