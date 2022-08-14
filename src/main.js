import { cubeLogic } from "./logic/cubeLogic";
import { cubeVisual } from "./view/cubeVisual";
import { eventConstrol } from "./view/eventContol";
import * as globals from "./logic/globals";

const logic = new cubeLogic();
console.log(logic.getState())
const view = new cubeVisual(logic);
console.log(view.indexToFaces)
console.log(view.faceToindex)
console.log(view.cubes)
console.log(view.positions)
//logic.rotate('x', 1, globals.DIRECTIONS.colckwise)
view.rotate('z', 2, globals.DIRECTIONS.colckwise)
//view.rotate('x', 1, globals.DIRECTIONS.colckwise)

const controls = new eventConstrol(logic, view)

// shuffle button -> get sequence from logic, implement in view
// solve button
