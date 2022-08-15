import { cubeLogic } from "./logic/cubeLogic";
import { cubeVisual } from "./view/cubeVisual";
import { eventConstrol } from "./view/eventContol";
import * as globals from "./logic/globals";

const logic = new cubeLogic();
console.log(logic.getState())
const view = new cubeVisual(logic);
console.log(view.indexToFaces)
console.log(view.faceToindex)
//update y spinning (like visual rotation)
//logic.rotate('y', 0, globals.DIRECTIONS.colckwise)
view.rotate('x', 1, globals.DIRECTIONS.colckwise)
view.rotate('y', 0, globals.DIRECTIONS.colckwise)
//console.log(view.faceToindex)
// view.rotate('z', 1, globals.DIRECTIONS.counterClockwise)

const controls = new eventConstrol(logic, view)

// shuffle button -> get sequence from logic, implement in view
// solve button
