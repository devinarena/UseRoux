
import Cubie from './cubie';
import { Group, Mesh } from 'three';

function Cube() {
    this.cube = [];
    this.moves = [];
    this.rotationDirection = '';
    this.rotationInverted = 1;
    this.rotationState = 0;
    this.rotateGroup = new Group();
    this.rotationDelay = 32;

    /**
     * Updates the cube by rotating it if necessary.
     * 
     * @param {Group} pivot to contain the cubies. 
     */
    this.update = (pivot) => {
        if (this.rotateGroup.children.length > 0) {
            // Rotate on the proper axis for each type of move
            if (this.rotationDirection == 'l' || this.rotationDirection == 'm')
                this.rotateGroup.rotateX(Math.PI / this.rotationDelay * this.rotationInverted);
            if (this.rotationDirection == 'r' || this.rotationDirection == 'x')
                this.rotateGroup.rotateX(-Math.PI / this.rotationDelay * this.rotationInverted);
            if (this.rotationDirection == 'u' || this.rotationDirection == 'y')
                this.rotateGroup.rotateY(-Math.PI / this.rotationDelay * this.rotationInverted);
            if (this.rotationDirection == 'd')
                this.rotateGroup.rotateY(Math.PI / this.rotationDelay * this.rotationInverted);
            if (this.rotationDirection == 'f' || this.rotationDirection == 'z')
                this.rotateGroup.rotateZ(-Math.PI / this.rotationDelay * this.rotationInverted);
            if (this.rotationDirection == 'b')
                this.rotateGroup.rotateZ(Math.PI / this.rotationDelay * this.rotationInverted);
            // we rotate incrementally for an animation
            this.rotationState++;
            // if we've hit the proper rotation (90 degrees)
            if (this.rotationState == this.rotationDelay / 2) {
                // remove the rotate group so we can add the cubies back to the pivot
                pivot.remove(this.rotateGroup);
                let cubies = [];
                // grab each cubie from the rotation group
                this.rotateGroup.traverse(cubie => {
                    if (cubie instanceof Mesh)
                        cubies.push(cubie);
                });
                // re-add the cubie to the pivot
                cubies.forEach(cubie => {
                    pivot.attach(cubie);
                });
                // reset the rotation group for the next move
                this.rotateGroup.rotation.set(0, 0, 0);
            }
        } else {
            // if we have moves in the moves queue
            if (this.moves.length > 0) {
                // rotate from the queue first move in the queue
                this.rotate(pivot, this.moves[0].toLowerCase(), this.moves[0].toUpperCase() == this.moves[0]);
                // remove the first move from the queue
                this.moves.splice(0, 1);
            }
        }
    }

    /**
     * Initializes the cube by adding 27 cubies to the cube array.
     * 
     * @param {Group} pivot to contain the cubies 
     */
    this.setupCube = (pivot) => {
        // for loop order doesn't matter but I like going from top down and accross
        for (let i = -1; i <= 1; i++) {
            for (let j = 1; j >= -1; j--) {
                for (let k = 1; k >= -1; k--) {
                    // we don't need a middle cubie, its not visible
                    if (i == 0 && j == 0 && k == 0) continue;
                    // add each cubie with a little bit of space in between
                    let cubie = new Cubie(i * 1.05, j * 1.05, k * 1.05);
                    this.cube.push(cubie);
                    // add cubie to the pivot group
                    pivot.attach(cubie.getCube());
                }
            }
        }
    }

    /**
     * Queues moves from a move string. String format must be: R U R2 U'
     * 
     * @param {String} moves the moves to add to the queue.
     */
     this.queueMoves = (moves) => {
        // Move strings are split by spaces, each move is a space
        moves.split(" ").forEach(c => {
            // Letter identification for the move
            let move = c[0];
            // Prime moves are reversed (represented as a capital letter)
            if (!c.endsWith("'"))
                move = move.toLowerCase();
            // add the move once or twice if its a double move
            this.moves.push(move);
            if (c.includes("2"))
                this.moves.push(move);
        });
    }

    /**
     * Queues moves in reverse from a move string. String format must be: R U R2 U'
     * 
     * @param {String} moves the moves to add to the queue in forwards order.
     */
    this.queueMovesReversed = (moves) => {
        let out = "";
        // for each move in the move string
        moves.split(" ").forEach(move => {
            // flip the moves (add or remove a rpime)
            if (move.endsWith("'"))
                move = move.substring(move, move.length - 1);
            else
                move += "'";
            // create a reversed output string
            out = move + " " + out;
        });
        // add the moves to the move queue
        this.queueMoves(out.trim());
    }

    /**
     * Getter for if the cube is currently rotating (move queue is not empty).
     * 
     * @returns {boolean} true if the move queue contains moves, false otherwise.
     */
    this.inProgress = () => {
        return this.moves.length > 0;
    }

    /**
     * Rotates a face of the cube like a real speed cube.
     * 
     * @param {Object3D} pivot the global pivot to use
     * @param {String} direction a directional code (R, L, U, D, B, F)
     * @param {boolean} inverted if the move is a prime move
     * @returns true if the rotation was successful, false otherwise
     */
    this.rotate = (pivot, direction, inverted) => {
        // if we're currently rotating stop
        if (this.rotateGroup.children.length != 0)
            return false;
        this.rotationDirection = direction;
        this.rotationInverted = inverted ? -1 : 1;
        this.rotationState = 0;
        // this just adds the proper cubies to the rotation group depending on the move
        if (this.rotationDirection == 'l') {
            this.cube.forEach(cubie => {
                if (cubie.getCube().position.x <= -1.05)
                    this.rotateGroup.add(cubie.getCube());
            });
        } else if (this.rotationDirection == 'r') {
            this.cube.forEach(cubie => {
                if (cubie.getCube().position.x >= 1.05)
                    this.rotateGroup.add(cubie.getCube());
            });
        } else if (this.rotationDirection == 'u') {
            this.cube.forEach(cubie => {
                if (cubie.getCube().position.y >= 1.05)
                    this.rotateGroup.add(cubie.getCube());
            });
        } else if (this.rotationDirection == 'd') {
            this.cube.forEach(cubie => {
                if (cubie.getCube().position.y <= -1.05)
                    this.rotateGroup.add(cubie.getCube());
            });
        } else if (this.rotationDirection == 'f') {
            this.cube.forEach(cubie => {
                if (cubie.getCube().position.z >= 1.05)
                    this.rotateGroup.add(cubie.getCube());
            });
        } else if (this.rotationDirection == 'b') {
            this.cube.forEach(cubie => {
                if (cubie.getCube().position.z <= -1.05)
                    this.rotateGroup.add(cubie.getCube());
            });
        } else if (this.rotationDirection == 'm') {
            this.cube.forEach(cubie => {
                if (cubie.getCube().position.x > -1 && cubie.getCube().position.x < 1)
                    this.rotateGroup.add(cubie.getCube());
            });
        }
        // These groups rotate the entire cube in a direction 
        else if (this.rotationDirection == 'x') {
            this.cube.forEach(cubie => {
                this.rotateGroup.add(cubie.getCube());
            });
        } else if (this.rotationDirection == 'y') {
            this.cube.forEach(cubie => {
                this.rotateGroup.add(cubie.getCube());
            });
        } else if (this.rotationDirection == 'z') {
            this.cube.forEach(cubie => {
                this.rotateGroup.add(cubie.getCube());
            });
        }
        pivot.add(this.rotateGroup);
        return true;
    }
}

export default Cube;