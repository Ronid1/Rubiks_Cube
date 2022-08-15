import * as globals from "./globals";
import * as rotation from "./rotationHelper";

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
    this.cubeState = rotation.rotate(axis, rowNum, direction, this.cubeState);
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
