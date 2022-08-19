import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as globals from "../logic/globals";

const FACES = { right: 0, left: 1, top: 2, bottom: 3, front: 4, back: 5 };

export class cubeVisual {
  constructor(cubeLogic, canvas) {
    //scene managment
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    //cube managment
    this.cubeLogic = cubeLogic;
    this.positions = [];
    this.cubes = [];
    this.moveQueue = [];
    this.makeingMove = false;
    this.indexToFaces = {};
    this.faceToindex = structuredClone(this.cubeLogic.getState());

    //start game
    this.initiateScene();
    this.animate();
    this.initiateRubiks();
  }

  initiateScene() {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.canvas.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setClearColor(0x000000, 0);

    //set lights and camera
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);
    const directLight = new THREE.AmbientLight(0xffffff, 0.7);
    directLight.position.set(10, 20, 0);
    this.scene.add(directLight);
    this.camera.position.set(5, 2, -3);

    window.addEventListener("resize", this.onWindowResize, false);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth / this.canvas.clientHeight);
  }

  initiateRubiks() {
    const cubeSize = 1;
    this.positions = this.initiateCubesPositions(cubeSize);
    this.mapFaceToIndex();
    this.mapIndexToFace();

    for (let index = 0; index < globals.ROW_SIZE ** globals.ROW_SIZE; index++) {
      let position = this.positions[index];
      let cube = this.initiateCube(index, cubeSize);
      cube.position.set(...position);
      this.scene.add(cube);
      this.cubes.push(cube);
    }
  }

  initiateCubesPositions(cubeSize) {
    const spacebetweenCubes = 0.05;
    let cubesPositions = [];
    let mid = Math.floor(globals.ROW_SIZE / 2) + spacebetweenCubes;

    for (let z = globals.ROW_SIZE - 1; z >= 0; z--) {
      for (let y = globals.ROW_SIZE - 1; y >= 0; y--) {
        for (let x = 0; x < globals.ROW_SIZE; x++) {
          cubesPositions.push([
            this.twoDigits(x * (cubeSize + spacebetweenCubes) - mid),
            this.twoDigits(y * (cubeSize + spacebetweenCubes) - mid),
            this.twoDigits(z * (cubeSize + spacebetweenCubes) - mid),
          ]);
        }
      }
    }
    return cubesPositions;
  }

  twoDigits(num) {
    return Math.round(num * 100) / 100;
  }

  repaintRubiks() {
    this.cubes.forEach((cube, index) => {
      cube.material = this.paintCube(index);
    });
  }

  paintCube(index) {
    const numOfFaces = 6;
    let material = [];
    const defaultColor = new THREE.MeshPhongMaterial({ color: "#1e1e1f" });

    [...Array(numOfFaces)].forEach(() => material.push(defaultColor));

    const visableFaces = this.indexToFaces[index];
    visableFaces.forEach((face) => {
      material[FACES[face]] = new THREE.MeshPhongMaterial({
        color: this.getCellsColor(face, index),
      });
    });
    return material;
  }

  highlight(face, index) {
    let highlightColors = {
      red: "#780101",
      "#e8651a": "#c94c04",
      yellow: "#858503",
      white: "#8c8989",
      green: "#025902",
      blue: "#020269",
    };

    let color = this.getCellsColor(face, index);
    if (!color) return -1;

    let cubie = this.cubes[index];
    cubie.material[FACES[face]] = new THREE.MeshPhongMaterial({
      color: highlightColors[color],
    });
  }

  stopHighlight(face, index) {
    let color = this.getCellsColor(face, index);
    let cubie = this.cubes[index];
    cubie.material[FACES[face]] = new THREE.MeshPhongMaterial({
      color: color,
    });
  }

  mapFaceToIndex() {
    const [minPos] = this.positions[0];
    const [maxPos] = this.positions[2];
    const x = 0;
    const y = 1;
    const z = 2;

    this.positions.forEach((position, index) => {
      if (position[x] === minPos)
        this.faceToindex["left"][Math.abs(Math.round(position[y]) - 1) % 3][
          Math.round(position[z]) + 1
        ] = index;
      if (position[x] === maxPos)
        this.faceToindex["right"][Math.abs(Math.round(position[y]) - 1)][
          Math.abs(Math.round(position[z]) - 1)
        ] = index;
      if (position[y] === minPos)
        this.faceToindex["bottom"][Math.abs(Math.round(position[z]) - 1) % 3][
          Math.round(position[x]) + 1
        ] = index;
      if (position[y] === maxPos) {
        this.faceToindex["top"][Math.round(position[z]) + 1][
          Math.round(position[x]) + 1
        ] = index;
      }
      if (position[z] === minPos) {
        this.faceToindex["back"][Math.abs(Math.round(position[y]) - 1)][
          Math.round(Math.abs(Math.round(position[x]) - 1))
        ] = index;
      }
      if (position[z] === maxPos) {
        this.faceToindex["front"][Math.abs(Math.round(position[y]) - 1) % 3][
          Math.round(position[x]) + 1
        ] = index;
      }
    });
  }

  mapIndexToFace() {
    const [minPos] = this.positions[0];
    const [maxPos] = this.positions[2];
    const x = 0;
    const y = 1;
    const z = 2;
    this.positions.forEach((position, index) => {
      let faces = [];
      if (position[x] === minPos) faces.push("left");
      if (position[x] === maxPos) faces.push("right");
      if (position[y] === minPos) faces.push("bottom");
      if (position[y] === maxPos) faces.push("top");
      if (position[z] === minPos) faces.push("back");
      if (position[z] === maxPos) faces.push("front");

      this.indexToFaces[index] = faces;
    });
  }

  initiateCube(index, cubeSize) {
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cube = new THREE.Mesh(geometry, this.paintCube(index));
    return cube;
  }

  getCellsColor(face, cubeIndex) {
    let row = -1,
      col = -1;
    this.faceToindex[face].forEach((val, r) => {
      for (let i = 0; i < this.faceToindex[face].length; i++) {
        if (this.faceToindex[face][r][i] === cubeIndex) {
          row = r;
          col = i;
          break;
        }
      }
    });
    if (row === -1) return null;
    return this.cubeLogic.getState()[face][row][col];
  }

  getCubeIndex(thisCubeId) {
    for (let index = 0; index < this.cubes.length; index++) {
      if (this.cubes[index].id === thisCubeId) return index;
    }
  }

  createLayer(axis, rowNum) {
    const cubesInLayer = this.getCubeInLayer(axis, rowNum);
    let layer = new THREE.Group();
    cubesInLayer.forEach((index) => {
      layer.add(this.cubes[index]);
    });
    return layer;
  }

  getCubeInLayer(axis, rowNum) {
    let cubesInLayer = new Set();
    const reverseIndex = globals.ROW_SIZE - 1 - rowNum;

    if (axis === "x") {
      globals.PLANES[axis].forEach((plain) => {
        this.faceToindex[plain][rowNum].forEach((index) => {
          cubesInLayer.add(index);
        });
      });
    } else if (axis === "y") {
      globals.PLANES[axis].forEach((plain) => {
        if (plain === "bottom") {
          this.faceToindex[plain][globals.ROW_SIZE - 1 - rowNum].forEach(
            (index) => {
              cubesInLayer.add(index);
            }
          );
        } else if (plain === "top") {
          this.faceToindex[plain][rowNum].forEach((index) => {
            cubesInLayer.add(index);
          });
        } else if (plain === "left") {
          this.faceToindex[plain].forEach((row) => {
            cubesInLayer.add(row[rowNum]);
          });
        } else {
          this.faceToindex[plain].forEach((row) => {
            cubesInLayer.add(row[globals.ROW_SIZE - 1 - rowNum]);
          });
        }
      });
    } else {
      globals.PLANES[axis].forEach((plane) => {
        let index = rowNum;
        this.faceToindex[plane].forEach((row) => {
          if (plane === "back") index = reverseIndex;
          cubesInLayer.add(row[index]);
        });
      });
    }
    return cubesInLayer;
  }

  disassembleLayer(layer) {
    this.scene.add(...layer.children);
    layer.remove(...layer.children);
  }

  rotate(axis, rowNum, direction) {
    // create queue for pending moves
    if (this.makeingMove) {
      this.moveQueue.push({ axis, rowNum, direction });
      return;
    }
    this.makeingMove = true;
    const layer = this.createLayer(axis, rowNum);
    this.scene.add(layer);

    this.rotationAnimation(layer, axis, direction).then(() => {
      this.makeingMove = false;
      this.disassembleLayer(layer);
      this.repaintRubiks();
      const next = this.moveQueue.shift();
      if (next) this.rotate(next.axis, next.rowNum, next.direction);
    });
  }

  async rotationAnimation(layer, axis, direction) {
    const DEGREE90 = 1.57;
    let step = 0.04;
    let angle = DEGREE90;
    if (direction === globals.DIRECTIONS.clockwise) {
      angle = -DEGREE90;
      step = -step;
    }

    if (axis === "z") {
      angle = -angle;
      step = -step;
    }

    let time = 0;
    let totalAngle = 0;
    return new Promise((resolve) => {
      function animateSpin(time) {
        if (
          (angle == DEGREE90 && totalAngle >= angle) ||
          (angle == -DEGREE90 && totalAngle <= angle)
        ) {
          return resolve();
        }
        if (axis === "x") layer.rotateY(step);
        else if (axis === "y") layer.rotateZ(step);
        else layer.rotateX(step);
        totalAngle = totalAngle + step;
        requestAnimationFrame(() => animateSpin(time));
      }
      animateSpin(time);
    });
  }
}
