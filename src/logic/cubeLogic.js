import * as globals from "./globals";

const lastRow = globals.ROW_SIZE - 1;

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

  getCubeCol(face, col, reverse = false) {
    if (reverse) col = lastRow - colNum;

    return this.cubeState[face].map((row) => {
      return row[col];
    });
  }

  rotate(axis, rowNum, direction) {
    const [firstFace] = globals.PLANES[axis];
    const circularPlane = [...globals.PLANES[axis], firstFace];

    if (direction === globals.DIRECTIONS.counterClockwise)
      circularPlane.reverse();

    switch (axis) {
      case "x":
        this.rotateX(circularPlane, rowNum);
        break;
      case "y":
        this.rotateY(circularPlane, rowNum);
        break;
      case "z":
        this.rotateZ(circularPlane, rowNum);
        break;
    }

    //rotating row 0 or 2 will cause corresponding face to spin
    if (rowNum === 0 || rowNum === lastRow)
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
    const reverseRowNum = lastRow - rowNum;

    const copyBottom = this.cubeState["bottom"][reverseRowNum];
    const copyTop = this.cubeState["top"][rowNum];
    const copyRight = this.getCubeCol("right", reverseRowNum);
    const copyLeft = this.getCubeCol("left", rowNum);

    circularPlane.forEach((face, index) => {
      let nextFace = circularPlane[index + 1];
      if (face === firstFace && index > 0) return;

      switch (face) {
        case "bottom":
          if (nextFace === "left")
            this.cubeState[face][reverseRowNum] = copyLeft;
          else this.cubeState[face][reverseRowNum] = copyRight.reverse();
          break;

        case "top":
          if (nextFace === "left")
            this.cubeState[face][rowNum] = copyLeft.reverse();
          else this.cubeState[face][rowNum] = copyRight;
          break;

        case "left":
          if (nextFace === "top") {
            this.cubeState[face].forEach((row, i) => {
              this.cubeState[face][i][rowNum] = copyTop.reverse()[i];
            });
          } else {
            this.cubeState[face].forEach((row, i) => {
              this.cubeState[face][lastRow - i][rowNum] =
                copyBottom.reverse()[i];
            });
          }
          break;

        case "right":
          if (nextFace === "top") {
            this.cubeState[face].forEach((row, i) => {
              this.cubeState[face][i][reverseRowNum] = copyTop[i];
            });
          } else {
            this.cubeState[face].forEach((row, i) => {
              this.cubeState[face][lastRow - i][reverseRowNum] = copyBottom[i];
            });
          }
          break;
      }
    });
  }

  rotateZ(circularPlane, colNum) {
    const reverseColNum = lastRow - colNum;
    const [firstFace] = circularPlane;
    let reverse = false;
    if (firstFace === "back") reverse = true;
    const copyFirstcol = this.getCubeCol(firstFace, colNum, reverse);

    circularPlane.forEach((face, index) => {
      [...Array(globals.ROW_SIZE)].forEach(() => {
        if (face === firstFace && index > 0) return;

        const nextFace = circularPlane[index + 1];

        if (nextFace === firstFace) {
          this.cubeState[face].map((row, i) => {
            row[colNum] = copyFirstcol[i];
          });
        } else {
          let col = colNum;
          let colToCopy = colNum;
          if (face === "back") col = reverseColNum;
          if (face === "top" && nextFace === "back")
            colToCopy = lastRow - colToCopy;

          this.cubeState[face].map((row, i) => {
            if (nextFace === "back" || face === "back") i = lastRow - i;
            row[col] = this.cubeState[nextFace][i][colToCopy];
          });
        }
      });
    });
  }

  rotateFace(face, direction) {
    let faceCopy = this.cubeState[face].map((arr) => {
      return arr.slice();
    });

    if (direction === globals.DIRECTIONS.clockwise) {
      for (let i = 0; i < globals.ROW_SIZE; i++) {
        let index = i;
        let colCopy = faceCopy.map((row) => {
          return row[i];
        });
        if (face === "bottom" || face === "right" || face === "back")
          index = lastRow - index;
        if (face === "front" || face === "top" || face === "left")
          colCopy = colCopy.reverse();
        this.cubeState[face][index] = colCopy;
      }
    } else {
      for (let i = globals.ROW_SIZE - 1; i >= 0; i--) {
        let index = i;
        const colCopy = faceCopy.map((row) => {
          return row[i];
        });
        if (face === "top" || face === "left" || face === "front")
          index = lastRow - index;
        if (face === "back" || face === "bottom" || face === "right")
          colCopy = colCopy.reverse();
        this.cubeState[face][index] = colCopy;
      }
    }
  }

  shuffle() {
    let moves = [];
    const axes = ["x", "y", "z"];
    const numOfRotates = this.random(16, 7);
    [...Array(numOfRotates)].forEach(() => {
      const axis = axes[this.random(3)];
      const row = this.random(globals.ROW_SIZE);
      const direction = Object.values(globals.DIRECTIONS)[this.random(2)];
      moves.push({ axis, row, direction });
    });

    return moves;
  }

  random(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
