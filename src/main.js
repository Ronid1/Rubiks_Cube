import { cubeLogic } from "./logic/cubeLogic";
import { cubeVisual } from "./view/cubeVisual";
import { eventConstrol } from "./view/eventContol";
import * as globals from "./logic/globals";

const logic = new cubeLogic();
const view = new cubeVisual(logic);
const controls = new eventConstrol(logic, view);

// add control buttons
const shuffleBtn = document.createElement("button");
shuffleBtn.innerHTML = "Shuffle";
document.getElementById("controls").appendChild(shuffleBtn);
shuffleBtn.onclick = () => shuffle()

const solveBtn = document.createElement("button");
solveBtn.innerHTML = "Solve";
document.getElementById("controls").appendChild(solveBtn);
solveBtn.onclick = () => solve()

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function shuffle() {
  let moves = logic.shuffle();
  let [firstMove] = moves;

  logic.rotate(firstMove.axis, firstMove.row, firstMove.direction);
  view.rotate(firstMove.axis, firstMove.row, firstMove.direction);

  for (let i = 1; i < moves.length; i++) {
    await delay(1500).then(() => {
      view.rotate(moves[i].axis, moves[i].row, moves[i].direction);
      logic.rotate(moves[i].axis, moves[i].row, moves[i].direction);
    });
  }
}

function solve(){
    return
}
