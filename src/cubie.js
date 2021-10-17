import { BoxGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three';
import { colors, faces } from "./constants";

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

    /**
     * Sets the color of a specific face of the cubie using Strings.
     * 
     * @param {String} side the side to update (from constants.js)
     * @param {String} color the color to set to (from constants.js)
     */

    this.setColor = (side, color) => {
        this.cubeMaterials[faces[side]].color.setHex(colors[color]);
    }

    /**
     * Function getter for getting the three.js cube object
     * 
     * @returns {Mesh} the three.js cube mesh 
     */
     this.getCube = () => {
        return this.cube;
    }
}

export default Cubie;