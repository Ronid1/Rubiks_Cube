import * as globals from "../logic/globals";
import * as THREE from "three";

const faces = {
  0: "right",
  1: "right",
  2: "left",
  3: "left",
  4: "top",
  5: "top",
  6: "bottom",
  7: "bottom",
  8: "front",
  9: "front",
  10: "back",
  11: "back",
};

export class eventConstrol {
  constructor(logic, view) {
    this.cubeLogic = logic;
    this.cubeView = view;
    this.makingMove = false;

    this.cubeIndex = 0;
    this.cubeFace = null;

    this.raycaster = new THREE.Raycaster();
    this.clickLocation = new THREE.Vector2();
    this.initiateEvents();
  }

  initiateEvents() {
    window.addEventListener("mousedown", (e) => this.onMouseDown(e));
    window.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
    window.addEventListener("mousemove", () => this.onMouseMove(), false);
  }

  onMouseDown(event) {
    this.clickLocation.x = this.relativeXLocation(event.clientX);
    this.clickLocation.y = this.relativeYLocation(event.clientY);
    this.raycaster.setFromCamera(this.clickLocation, this.cubeView.camera);
    const [intersect] = this.raycaster.intersectObjects(
      this.cubeView.cubes,
      true
    );
    if (!intersect) return;

    //disaple cube movment
    this.cubeView.controls.enable = false;
    this.makingMove = true;
    this.cubeIndex = this.cubeView.getCubeIndex(intersect.object.id);
    console.log(this.cubeIndex)
    this.cubeFace = faces[intersect.faceIndex];
  }

  relativeXLocation(x) {
    return (x / window.innerWidth) * 2 - 1;
  }

  relativeYLocation(y) {
    return -(y / window.innerHeight) * 2 + 1;
  }

  onMouseUp(event) {
    this.cubeView.controls.enable = true;

    if (!this.makingMove) return;

    let x = this.relativeXLocation(event.clientX);
    let y = this.relativeYLocation(event.clientY);

    // if dist < ?? don't make a move

    //find direction by determining which box end point is closest to
    // axis between start and end point

    //axis (x,y,z)
    // x is pernment
    // y/z can change (up/down spin 360)
    //calculate direction

    // update state and view
    // this.cubeLogic.rotate(axis, rowNum, direction);
    // this.cubeView.rotate(axis, rowNum, direction);
  }

  onMouseMove(event) {}

}
