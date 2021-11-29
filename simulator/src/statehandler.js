/**
 * @file: statehandler.js
 * @author: Devin Arena
 * @since 10/17/2021
 * @description Manages changing pages, e.g. going from intro to first block. Updates
 *              HTML elements and handles animations.
 */

import { solutionData, steps } from "./database";

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
    setTimeout(() => {
        dialogs[currPage].className = dialogs[currPage].className.substring(0, dialogs[currPage].className.length - 7);
        dialogs[currPage].style.opacity = 1;
    }, 1000);
    if (dialogs[currPage].className.split(" ")[1] === "scramble") {
        cube.queueMoves(solutionData.scramble);
    }
    dialogs[currPage - 1].style.opacity = 0;
    setTimeout(() => {
        dialogs[currPage - 1].className += " hidden";
    }, 1000);

    // Grab the step from the classname and queue the moves associated with that step
    let className = dialogs[currPage].className;
    if (className.includes(" ") && className.split(" ").length > 0 && className.split(" ")[1].includes("step")) {
        let step = className.split(" ")[1].replace("step", "");
        cube.queueMoves(steps[step].algorithm);
    }
}

/**
 * Moves to the previous page when the previous button is pressed.
 * 
 * @param {Cube} cube the cube to update when pages are changed.
 */
const prevPage = (cube) => {
    // if we're at the first page or the cube is currently rotating, we can't change the page
    if (currPage <= 1 || cube.inProgress())
        return;
    // moves to the previous page
    currPage--;
    setTimeout(() => {
        dialogs[currPage].className = dialogs[currPage].className.substring(0, dialogs[currPage].className.length - 7);
        dialogs[currPage].style.opacity = 1;
    }, 1000);
    dialogs[currPage + 1].style.opacity = 0;
    setTimeout(() => {
        dialogs[currPage + 1].className += " hidden";
    }, 1000);

    // Grab the step from the classname and queue the moves associated with that step
    let className = dialogs[currPage + 1].className;
    if (className.includes(" ") && className.split(" ").length > 0 && className.split(" ")[1].includes("step")) {
        let step = className.split(" ")[1].replace("step", "");
        cube.queueMovesReversed(steps[step].algorithm);
    }
}

/**
 * Sets up navigation elements with their respective event listeners.
 */
const setupUINavigation = (cube) => {
    const nb = document.getElementById("nextButton");
    const pb = document.getElementById("prevButton");
    if (!nb || !pb)
        return;
    nb.onclick = () => nextPage(cube);
    pb.onclick = () => prevPage(cube);
    for (let i = 1; i < dialogs.length; i++)
        dialogs[i].style.opacity = 0;
}

export { setupUINavigation };