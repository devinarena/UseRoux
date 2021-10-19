import { BoxGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three';
import { colors, faces, faceList } from "./constants";

/**
 * @file: Cubie.js
 * @author: Devin Arena
 * @since 10/15/2021
 * @description Stores information about cube pieces (cubies), allows
 *              simple editing of face colors, etc.
 */

/**
 * Cubie function stores an x, y, and z coordinate and creates
 * a three.js cube with updatable face colors.
 * 
 * @param {number} x coordinate in 3d space
 * @param {number} y coordinate in 3d space
 * @param {number} z coordinate in 3d space
 */
function Cubie(x, y, z) {
    // create cube geometry
    this.geometry = new BoxGeometry(1, 1, 1);
    // each face needs a meshbasicmaterial to store color
    this.cubeMaterials = [
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
    ];
    // create the actual mesh
    this.cube = new Mesh(this.geometry, this.cubeMaterials);
    // set position to given position
    this.cube.position.set(x, y, z);
    this.faceColors = {};

    /**
     * Reassigns face colors based on a rotation.
     * 
     * @param {Character} axis either 'x', 'y', or 'z' axis
     * @param {boolean} clockwise if the rotation is clockwise or counterclockwise
     */
    this.rotate = (axis, clockwise) => {
        if (axis === 'x') {
            if (clockwise) {
                let temp = this.faceColors["top"];
                this.faceColors["top"] = this.faceColors["back"];
                this.faceColors["back"] = this.faceColors["bottom"];
                this.faceColors["bottom"] = this.faceColors["front"];
                this.faceColors["front"] = temp;
            } else {
                let temp = this.faceColors["top"];
                this.faceColors["top"] = this.faceColors["front"];
                this.faceColors["front"] = this.faceColors["bottom"];
                this.faceColors["bottom"] = this.faceColors["back"];
                this.faceColors["back"] = temp;
            }
        } else if (axis === 'y') {
            if (clockwise) {
                let temp = this.faceColors["front"];
                this.faceColors["front"] = this.faceColors["right"];
                this.faceColors["right"] = this.faceColors["back"];
                this.faceColors["back"] = this.faceColors["left"];
                this.faceColors["left"] = temp;
            } else {
                let temp = this.faceColors["front"];
                this.faceColors["front"] = this.faceColors["left"];
                this.faceColors["left"] = this.faceColors["back"];
                this.faceColors["back"] = this.faceColors["right"];
                this.faceColors["right"] = temp;
            }
        } else if (axis == 'z') {
            if (clockwise) {
                let temp = this.faceColors["top"];
                this.faceColors["top"] = this.faceColors["left"];
                this.faceColors["left"] = this.faceColors["bottom"];
                this.faceColors["bottom"] = this.faceColors["right"];
                this.faceColors["right"] = temp;
            } else {
                let temp = this.faceColors["top"];
                this.faceColors["top"] = this.faceColors["right"];
                this.faceColors["right"] = this.faceColors["bottom"];
                this.faceColors["bottom"] = this.faceColors["left"];
                this.faceColors["left"] = temp;
            }
        }
    }

    /**
     * Sets the color of a specific face of the cubie using Strings.
     * 
     * @param {String} side the side to update (from constants.js)
     * @param {String} color the color to set to (from constants.js)
     */

    this.setColor = (side, color) => {
        this.cubeMaterials[faces[side]].color.setHex(colors[color]);
        this.faceColors[side] = color;
    }

    /**
     * Function getter for getting the three.js cube object
     * 
     * @returns {Mesh} the three.js cube mesh 
     */
     this.getCube = () => {
        return this.cube;
    }

    /**
     * Prints out a dictionary of each color of each face.
     * 
     * @returns a dictionary of each face and color (will be used for states)
     */
    this.getFaces = () => {
        return this.faceColors;
    }
}

export default Cubie;