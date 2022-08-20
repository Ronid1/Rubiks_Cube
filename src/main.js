import { cubeLogic } from "./logic/cubeLogic";
import { cubeVisual } from "./view/cubeVisual";
import { eventConstrol } from "./view/eventContol";

const canvas = document.getElementById("canvas")
const logic = new cubeLogic();
const view = new cubeVisual(logic, canvas);
const controls = new eventConstrol(logic, view,canvas);

// add control buttons
const shuffleBtn = document.createElement("button");
shuffleBtn.innerHTML = "Shuffle";
document.getElementById("controls").appendChild(shuffleBtn);
shuffleBtn.onclick = () => shuffle();

const resetBtn = document.createElement("button");
resetBtn.innerHTML = "Reset";
document.getElementById("controls").appendChild(resetBtn);
resetBtn.onclick = () => reset();

// const solveBtn = document.createElement("button");
// solveBtn.innerHTML = "Solve";
// document.getElementById("controls").appendChild(solveBtn);
// solveBtn.onclick = () => solve()

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function shuffle() {
  let moves = logic.shuffle();
  let [firstMove] = moves;

  logic.rotate(firstMove.axis, firstMove.row, firstMove.direction);
  view.rotate(firstMove.axis, firstMove.row, firstMove.direction);

  for (let i = 1; i < moves.length; i++) {
    await delay(850).then(() => {
      view.rotate(moves[i].axis, moves[i].row, moves[i].direction);
      logic.rotate(moves[i].axis, moves[i].row, moves[i].direction);
    });
  }
}

function reset(){
  logic.resetCube();
  view.repaintRubiks();
}

// function solve(){
//     logic.rotate('x',0,1)
//     view.rotate('x',0, 1)
//     delay(2000).then(() => {
//         logic.rotate('y',0,-1)
//         view.rotate('y',0,-1)
//     })
//     delay(4000).then(() => {
//         logic.rotate('z',2,-1)
//         view.rotate('z',2,-1)
//     })
// }
