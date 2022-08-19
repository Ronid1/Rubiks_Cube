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

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

export class eventConstrol {
  constructor(logic, view, canvas) {
    this.cubeLogic = logic;
    this.cubeView = view;
    this.canvas = canvas;
    this.makingMove = false;

    this.cubeIndex = null;
    this.cubeFace = null;

    this.raycaster = new THREE.Raycaster();
    this.clickLocation = new THREE.Vector2();
    this.initiateEvents();
  }

  initiateEvents() {
    window.addEventListener("mousedown", (e) => this.onMouseDown(e));
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
  }

  onMouseDown(event) {
    if (this.cubeFace || this.cubeIndex) {
      this.cubeView.stopHighlight(this.cubeFace, this.cubeIndex);
      this.cubeFace = null;
      this.cubeIndex = null;
    }

    this.clickLocation.x = this.relativeXLocation(event.clientX);
    this.clickLocation.y = this.relativeYLocation(event.clientY);
    this.raycaster.setFromCamera(this.clickLocation, this.cubeView.camera);
    const [intersect] = this.raycaster.intersectObjects(
      this.cubeView.scene.children,
      true
    );
    if (!intersect) return;

    this.makingMove = true;
    this.cubeIndex = this.cubeView.getCubeIndex(intersect.object.id);
    this.cubeFace = faces[intersect.faceIndex];

    if (this.cubeView.highlight(this.cubeFace, this.cubeIndex) === -1) {
      this.makingMove = false;
      this.cubeFace = null;
      this.cubeIndex = null;
    }
  }

  relativeXLocation(x) {
    return (x / window.innerWidth) * 2 - 1;
  }

  relativeYLocation(y) {
    return -(y / window.innerHeight) * 2 + 1;
  }

  getSelectedRowAndCol() {
    let row, col;
    this.cubeView.faceToindex[this.cubeFace].forEach((line, i) => {
      line.forEach((value, j) => {
        if (value === this.cubeIndex) {
          row = i;
          col = j;
        }
      });
    });
    return { row, col };
  }

  onKeyDown(event) {
    if (!this.makingMove) return;

    let { row, col } = this.getSelectedRowAndCol();

    switch (event.keyCode) {
      case UP:
        this.rotateUp(col);
        this.makingMove = false;
        break;
      case DOWN:
        this.rotateDown(col);
        this.makingMove = false;
        break;
      case RIGHT:
        this.rotateRight(row);
        this.makingMove = false;
        break;
      case LEFT:
        this.rotateLeft(row);
        this.makingMove = false;
        break;
      default:
        this.makingMove = false;
    }
  }

  rotateUp(col) {
    let lastRow = globals.ROW_SIZE - 1;
    switch (this.cubeFace) {
      case "front":
        this.cubeLogic.rotate("z", col, globals.DIRECTIONS.counterClockwise);
        this.cubeView.rotate("z", col, globals.DIRECTIONS.counterClockwise);
        break;

      case "back":
        this.cubeLogic.rotate("z", lastRow - col, globals.DIRECTIONS.clockwise);
        this.cubeView.rotate("z", lastRow - col, globals.DIRECTIONS.clockwise);
        return;

      case "right":
        this.cubeLogic.rotate(
          "y",
          lastRow - col,
          globals.DIRECTIONS.counterClockwise
        );
        this.cubeView.rotate(
          "y",
          lastRow - col,
          globals.DIRECTIONS.counterClockwise
        );
        return;

      case "left":
        this.cubeLogic.rotate("y", col, globals.DIRECTIONS.clockwise);
        this.cubeView.rotate("y", col, globals.DIRECTIONS.clockwise);
        return;

      case "bottom":
      case "top":
        this.cubeLogic.rotate("z", col, globals.DIRECTIONS.counterClockwise);
        this.cubeView.rotate("z", col, globals.DIRECTIONS.counterClockwise);
        return;
    }
  }

  rotateDown(col) {
    let lastRow = globals.ROW_SIZE - 1;
    switch (this.cubeFace) {
      case "front":
        this.cubeLogic.rotate("z", col, globals.DIRECTIONS.clockwise);
        this.cubeView.rotate("z", col, globals.DIRECTIONS.clockwise);
        return;

      case "back":
        this.cubeLogic.rotate(
          "z",
          lastRow - col,
          globals.DIRECTIONS.counterClockwise
        );
        this.cubeView.rotate(
          "z",
          lastRow - col,
          globals.DIRECTIONS.counterClockwise
        );
        return;

      case "right":
        this.cubeLogic.rotate("y", lastRow - col, globals.DIRECTIONS.clockwise);
        this.cubeView.rotate("y", lastRow - col, globals.DIRECTIONS.clockwise);
        return;

      case "left":
        this.cubeLogic.rotate("y", col, globals.DIRECTIONS.counterClockwise);
        this.cubeView.rotate("y", col, globals.DIRECTIONS.counterClockwise);
        return;

      case "bottom":
      case "top":
        this.cubeLogic.rotate("z", col, globals.DIRECTIONS.clockwise);
        this.cubeView.rotate("z", col, globals.DIRECTIONS.clockwise);
        return;
    }
  }

  rotateRight(row) {
    let lastRow = globals.ROW_SIZE - 1;
    switch (this.cubeFace) {
      case "front":
      case "back":
      case "right":
      case "left":
        this.cubeLogic.rotate("x", row, globals.DIRECTIONS.counterClockwise);
        this.cubeView.rotate("x", row, globals.DIRECTIONS.counterClockwise);
        return;

      case "bottom":
        this.cubeLogic.rotate(
          "y",
          lastRow - row,
          globals.DIRECTIONS.counterClockwise
        );
        this.cubeView.rotate(
          "y",
          lastRow - row,
          globals.DIRECTIONS.counterClockwise
        );
        return;
      case "top":
        this.cubeLogic.rotate("y", row, globals.DIRECTIONS.clockwise);
        this.cubeView.rotate("y", row, globals.DIRECTIONS.clockwise);
        return;
    }
  }

  rotateLeft(row) {
    let lastRow = globals.ROW_SIZE - 1;
    switch (this.cubeFace) {
      case "front":
      case "back":
      case "right":
      case "left":
        this.cubeLogic.rotate("x", row, globals.DIRECTIONS.clockwise);
        this.cubeView.rotate("x", row, globals.DIRECTIONS.clockwise);
        return;

      case "bottom":
        this.cubeLogic.rotate("y", lastRow - row, globals.DIRECTIONS.clockwise);
        this.cubeView.rotate("y", lastRow - row, globals.DIRECTIONS.clockwise);
        return;
      case "top":
        this.cubeLogic.rotate("y", row, globals.DIRECTIONS.counterClockwise);
        this.cubeView.rotate("y", row, globals.DIRECTIONS.counterClockwise);
        return;
    }
  }
}
