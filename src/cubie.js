import { BoxGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three';
import { colors, faces } from "./constants";

function Cubie(x, y, z) {
    const geometry = new BoxGeometry(1, 1, 1);
    const cubeMaterials = [
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
        new MeshBasicMaterial({color: 0, side: DoubleSide}),
    ];
    const cube = new Mesh(geometry, cubeMaterials);
    cube.position.set(x, y, z);

    Cubie.prototype.setColor = (side, color) => {
        console.log(faces, colors, side, color);
        cubeMaterials[faces[side]].color.setHex(colors[color]);
    }

    Cubie.prototype.getCube = () => {
        return cube;
    }
}

export default Cubie;