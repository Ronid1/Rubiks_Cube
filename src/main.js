import { cubeLogic } from "./logic/cubeLogic";
import { cubeVisual } from "./view/cubeVisual";
import { eventConstrol } from "./view/eventContol";
import * as globals from "./logic/globals";

const logic = new cubeLogic();
const view = new cubeVisual(logic);
const controls = new eventConstrol(logic, view);

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function shuffle(){
    let moves = logic.shuffle();
    let [firstMove] = moves
    
    logic.rotate(firstMove.axis, firstMove.row, firstMove.direction);
    view.rotate(firstMove.axis, firstMove.row, firstMove.direction);

    for (let i = 1; i < moves.length; i++){
        await delay(2000).then(() => {
            view.rotate(moves[i].axis, moves[i].row, moves[i].direction);
            logic.rotate(moves[i].axis, moves[i].row, moves[i].direction);

          });
    }
        
}

shuffle()