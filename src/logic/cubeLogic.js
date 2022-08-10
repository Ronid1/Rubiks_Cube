import * as globals from "./globals";

/*
 * https://www.reddit.com/r/Cubers/comments/k4ssk5/i_wrote_a_blog_post_on_how_to_build_a_cube_solver/
 */

export class cubeLogic {
  constructor() {
    this.cubeState = {
      front: [],
      back: [],
      top: [],
      bottom: [],
      right: [],
      left: [],
    };

    this.initializeCube();
  }

  initializeCube() {
    let i = 0;
    for (let face in this.cubeState) {
      const color = globals.COLORS[i];
      [...Array(globals.ROW_SIZE)].map(() => {
        this.cubeState[face].push(new Array(globals.ROW_SIZE).fill(color));
      });
      i++;
    }
  }

  getState() {
    return this.cubeState;
  }

  rotate(axis, rowNum, direction) {
    const [firstFace] = globals.PLAINS[axis];
    const circularPlane = [...globals.PLAINS[axis], firstFace];

    if (direction === globals.DIRECTIONS.counterClockwise)
      circularPlane.reverse();

    if (axis === "x") this.rotateX(circularPlane, rowNum);
    else this.rotateYZ(circularPlane, rowNum);
  }

  rotateX(circularPlane, rowNum) {
    const [firstFace] = circularPlane;
    const copyFirstRow = this.cubeState[firstFace][rowNum];

    circularPlane.forEach((face, index) => {
      if (face === firstFace && index > 0) return;
      const nextFace = circularPlane[index + 1];
      if (nextFace === firstFace) this.cubeState[face][rowNum] = copyFirstRow;
      else this.cubeState[face][rowNum] = this.cubeState[nextFace][rowNum];
    });
  }

  rotateYZ(circularPlane, colNum) {
    const [firstFace] = circularPlane;
    const copyFirstcol = this.cubeState[firstFace].map((row) => {
      return row[colNum];
    });

    circularPlane.forEach((face, index) => {
      [...Array(globals.ROW_SIZE)].forEach(() => {
        if (face === firstFace && index > 0) return;

        const nextFace = circularPlane[index + 1];

        if (nextFace === firstFace)
          this.cubeState[face].map((row, i) => {
            row[colNum] = copyFirstcol[i];
          });
        else
          this.cubeState[face].map((row, i) => {
            row[colNum] = this.cubeState[nextFace][i][colNum];
          });
      });
    });
  }

  shuffle() {
    const axes = ["x", "y", "z"];
    const numOfRotates = this.random(31, 16);
    [...Array(numOfRotates)].forEach(() => {
      const axis = axes[this.random(3)];
      const row = this.random(globals.ROW_SIZE);
      const direction = Object.keys(globals.DIRECTIONS)[this.random(2)];
      console.log(`axis: ${axis}, row: ${row}, direction: ${direction}`)
      this.rotate(axis, row, direction);
    });
  }

  random(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
