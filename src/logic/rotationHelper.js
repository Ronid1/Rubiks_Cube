import * as globals from "./globals";

export function rotate(axis, rowNum, direction, state) {
  const [firstFace] = globals.PLAINS[axis];
  const circularPlane = [...globals.PLAINS[axis], firstFace];
  let updatedState = [];

  if (direction === globals.DIRECTIONS.counterClockwise)
    circularPlane.reverse();

  if (axis === "x") updatedState = rotateX(circularPlane, rowNum, state);
  else if (axis === "y") updatedState = rotateY(circularPlane, rowNum, state);
  else updatedState = rotateY(circularPlane, rowNum, state);

  //rotating row 0 or 2 will cause corresponding face to spin
  if (rowNum === 0 || rowNum === globals.ROW_SIZE - 1)
    updatedState = rotateFace(
      globals.CHAIN_REACTION[axis][rowNum],
      direction,
      updatedState
    );

  return updatedState;
}

export function rotateX(circularPlane, rowNum, cubeState) {
  const [firstFace] = circularPlane;
  const copyFirstRow = cubeState[firstFace][rowNum];

  circularPlane.forEach((face, index) => {
    if (face === firstFace && index > 0) return;
    const nextFace = circularPlane[index + 1];
    if (nextFace === firstFace) cubeState[face][rowNum] = copyFirstRow;
    else cubeState[face][rowNum] = cubeState[nextFace][rowNum];
  });

  return cubeState;
}

export function rotateY(circularPlane, rowNum, cubeState) {
  circularPlane = circularPlane.reverse();
  const [firstFace] = circularPlane;
  const reverseIndex = globals.ROW_SIZE - 1 - rowNum

  const copyBottom = cubeState["bottom"][reverseIndex];
  const copyTop = cubeState["top"][rowNum];
  const copyRight = cubeState["right"].map((row) => {
    return row[reverseIndex];
  });
  const copyLeft = cubeState["left"].map((row) => {
    return row[rowNum];
  });

  circularPlane.forEach((face, index) => {
    if (face === firstFace && index > 0) return;
    if (face === "bottom") {
      if (circularPlane[index + 1] === "left")
        cubeState[face][rowNum] = copyLeft.reverse()
      else cubeState[face][rowNum] = copyRight.reverse()
    
    } else if (face === "top") {
      if (circularPlane[index + 1] === "left")
        cubeState[face][rowNum] = copyLeft.reverse();
      else cubeState[face][rowNum] = copyRight.reverse();
    
    } else if (face === "left") {
      if (circularPlane[index + 1] === "top") {
        cubeState[face].forEach((row, i) => {
          cubeState[face][i][rowNum] = copyTop[i];
        });
      } else {
        console.log(copyBottom)
        cubeState[face].forEach((row, i) => {
          cubeState[face][i][rowNum] = copyBottom[i];
        });
      }
    
    } else {
      if (circularPlane[index + 1] === "top") {
        cubeState[face].forEach((row, i) => {
          cubeState[face][i][reverseIndex] = copyTop[i];
        });
      } else {
        cubeState[face].forEach((row, i) => {
          cubeState[face][i][reverseIndex] = copyBottom[i];
        });
      }
    }
  });
  return cubeState;
}

export function rotateZ(circularPlane, colNum, cubeState) {
  const [firstFace] = circularPlane;
  const copyFirstcol = cubeState[firstFace].map((row) => {
    return row[colNum];
  });

  circularPlane.forEach((face, index) => {
    [...Array(globals.ROW_SIZE)].forEach(() => {
      if (face === firstFace && index > 0) return;

      const nextFace = circularPlane[index + 1];

      if (nextFace === firstFace)
        cubeState[face].map((row, i) => {
          row[colNum] = copyFirstcol[i];
        });
      else
        cubeState[face].map((row, i) => {
          row[colNum] = cubeState[nextFace][i][colNum];
        });
    });
  });

  return cubeState;
}

export function rotateFace(face, direction, cubeState) {
  let faceCopy = cubeState[face].map((arr) => {
    return arr.slice();
  });

  //row0 = ex_col0, row1 = ex_col1, row2 = ex_col2
  if (direction === globals.DIRECTIONS.colckwise) {
    for (let index = 0; index < globals.ROW_SIZE; index++) {
      const colCopy = faceCopy.map((row) => {
        return row[index];
      });

      cubeState[face][index] = colCopy;
    }
  }

  //row0 = ex_col2, row1 = ex_col1, row2 = ex_col0
  else {
    for (let index = globals.ROW_SIZE; index >= 0; index--) {
      const colCopy = faceCopy.map((row) => {
        return row[index];
      });

      cubeState[face][Math.abs(index - globals.ROW_SIZE)] = colCopy;
    }
  }

  return cubeState;
}
