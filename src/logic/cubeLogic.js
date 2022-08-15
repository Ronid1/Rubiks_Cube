import * as globals from "./globals";
/*
 * https://www.reddit.com/r/Cubers/comments/k4ssk5/i_wrote_a_blog_post_on_how_to_build_a_cube_solver/
 */

export class cubeLogic {
  constructor() {
    this.cubeState = {
      right: [],
      left: [],
      top: [],
      bottom: [],
      front: [],
      back: [],
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
    else if (axis === "y") this.rotateY(circularPlane, rowNum);
    else this.rotateZ(circularPlane, rowNum);

    //rotating row 0 or 2 will cause corresponding face to spin
    if (rowNum === 0 || rowNum === globals.ROW_SIZE - 1)
      this.rotateFace(globals.CHAIN_REACTION[axis][rowNum], direction);
  }

  rotateX(circularPlane, rowNum) {
    const [firstFace] = circularPlane;
    const copyFirstRow = this.cubeState[firstFace][rowNum];

    circularPlane.forEach((face, index) => {
      if (face === firstFace && index > 0) return;
      let nextFace = circularPlane[index + 1];
      if (nextFace === firstFace) this.cubeState[face][rowNum] = copyFirstRow;
      else this.cubeState[face][rowNum] = this.cubeState[nextFace][rowNum];
    });
  }

  rotateY(circularPlane, rowNum) {
    circularPlane = circularPlane.reverse();
    const [firstFace] = circularPlane;
    const reverseIndex = globals.ROW_SIZE - 1 - rowNum;

    const copyBottom = this.cubeState["bottom"][reverseIndex];
    const copyTop = this.cubeState["top"][rowNum];
    const copyRight = this.cubeState["right"].map((row) => {
      return row[reverseIndex];
    });
    const copyLeft = this.cubeState["left"].map((row) => {
      return row[rowNum];
    });

    circularPlane.forEach((face, index) => {
      if (face === firstFace && index > 0) return;
      if (face === "bottom") {
        if (circularPlane[index + 1] === "left")
          this.cubeState[face][reverseIndex] = copyLeft.reverse();
        else this.cubeState[face][reverseIndex] = copyRight.reverse();
      } else if (face === "top") {
        if (circularPlane[index + 1] === "left")
          this.cubeState[face][rowNum] = copyLeft.reverse();
        else this.cubeState[face][rowNum] = copyRight.reverse();
      } else if (face === "left") {
        if (circularPlane[index + 1] === "top") {
          this.cubeState[face].forEach((row, i) => {
            this.cubeState[face][i][rowNum] = copyTop[i];
          });
        } else {
          this.cubeState[face].forEach((row, i) => {
            this.cubeState[face][i][rowNum] = copyBottom[i];
          });
        }
      } else {
        if (circularPlane[index + 1] === "top") {
          this.cubeState[face].forEach((row, i) => {
            this.cubeState[face][i][reverseIndex] = copyTop[i];
          });
        } else {
          this.cubeState[face].forEach((row, i) => {
            this.cubeState[face][i][reverseIndex] = copyBottom[i];
          });
        }
      }
    });
  }

  rotateZ(circularPlane, colNum) {
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

  rotateFace(face, direction) {
    let faceCopy = this.cubeState[face].map((arr) => {
      return arr.slice();
    });
    //row0 = ex_col0, row1 = ex_col1, row2 = ex_col2
    if (direction === globals.DIRECTIONS.colckwise) {
      for (let index = 0; index < globals.ROW_SIZE; index++) {
        const colCopy = faceCopy.map((row) => {
          return row[index];
        });

        this.cubeState[face][index] = colCopy;
      }
    }

    //row0 = ex_col2, row1 = ex_col1, row2 = ex_col0
    else {
      for (let index = globals.ROW_SIZE - 1; index >= 0; index--) {
        const colCopy = faceCopy.map((row) => {
          return row[index];
        });
        this.cubeState[face][Math.abs(index - globals.ROW_SIZE)] = colCopy;
      }
    }
  }

  shuffle() {
    const axes = ["x", "y", "z"];
    const numOfRotates = this.random(31, 16);
    [...Array(numOfRotates)].forEach(() => {
      const axis = axes[this.random(3)];
      const row = this.random(globals.ROW_SIZE);
      const direction = Object.keys(globals.DIRECTIONS)[this.random(2)];
      console.log(`axis: ${axis}, row: ${row}, direction: ${direction}`);
      this.rotate(axis, row, direction);
    });
  }

  random(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
