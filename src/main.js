import { cubeLogic } from "./logic/cubeLogic";
import { cubeVisual } from "./view/cubeVisual";
import { eventConstrol } from "./view/eventContol";
import * as globals from "./logic/globals";

const logic = new cubeLogic();
const view = new cubeVisual(logic);
const controls = new eventConstrol(logic, view);

logic.rotate("y", 2, globals.DIRECTIONS.counterClockwise);
view.rotate("y", 2, globals.DIRECTIONS.colcounterClockwiseckwise);
delay(2000).then(() => {
  logic.rotate("z", 2, globals.DIRECTIONS.counterClockwise);
  view.rotate("z", 2, globals.DIRECTIONS.counterClockwise);
});

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
