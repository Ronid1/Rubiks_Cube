import { cubeLogic } from "./logic/cubeLogic";
import { cubeVisual } from "./view/cubeVisual";
import * as globals from "./logic/globals";

const logic = new cubeLogic();
const view = new cubeVisual(logic);