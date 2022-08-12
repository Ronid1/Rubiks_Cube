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

    //rotating row 0 or 2 will cause corresponding face to spin
    if (rowNum === 0 || rowNum === globals.ROW_SIZE - 1)
      this.rotateFace(globals.CHAIN_REACTION[axis][rowNum], direction);
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
      for (let index = globals.ROW_SIZE; index >= 0; index--) {
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

  // getSharedCubes() {
  //   const lastIndex = globals.ROW_SIZE - 1;

  //   let corners = [
  //     { front: [0, 0], top: [lastIndex, 0], left: [0, lastIndex] },
  //     {
  //       front: [0, lastIndex],
  //       top: [lastIndex, lastIndex],
  //       right: [0, 0],
  //     },
  //     {
  //       front: [lastIndex, 0],
  //       bottom: [0, 0],
  //       left: [lastIndex, lastIndex],
  //     },
  //     {
  //       front: [lastIndex, lastIndex],
  //       bottom: [0, lastIndex],
  //       right: [lastIndex, 0],
  //     },

  //     { back: [0, 0], top: [0, 0], left: [0, 0] },
  //     {
  //       back: [0, lastIndex],
  //       top: [0, lastIndex],
  //       right: [0, lastIndex],
  //     },
  //     { back: [lastIndex, 0], bottom: [0, 0], left: [lastIndex, 0] },
  //     {
  //       back: [lastIndex, lastIndex],
  //       bottom: [lastIndex, 0],
  //       right: [lastIndex, lastIndex],
  //     },
  //   ];

  //   let edges = [];
  //   for (let i = 1; i < lastIndex; i++) {
  //     edges.push({ front: [0, i], top: [lastIndex, i] });
  //     edges.push({ front: [i, 0], left: [i, lastIndex] });
  //     edges.push({ front: [i, lastIndex], right: [0, i] });
  //     edges.push({ front: [i, i], bottom: [0, i] });

  //     edges.push({ back: [0, i], top: [0, i] });
  //     edges.push({ back: [i, 0], left: [i, 0] });
  //     edges.push({ back: [i, lastIndex], right: [i, lastIndex] });
  //     edges.push({ back: [i, i], bottom: [lastIndex, i] });
  //   }

  //   return [...corners, ...edges];
  // }
}
