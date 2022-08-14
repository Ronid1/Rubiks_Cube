import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as globals from "../logic/globals";

export class cubeVisual {
  constructor(cubeLogic) {
    //scene managment
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    //cube managment
    this.cubeLogic = cubeLogic;
    this.positions = [];
    this.cubes = [];
    this.makeingMove = false;
    this.indexToFaces = {};
    this.faceToindex = structuredClone(this.cubeLogic.getState());

    //start game
    this.initiateScene();
    this.animate();
    this.initiateRubiks();
  }

  initiateScene() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);

    //set lights and camera
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);
    const directLight = new THREE.AmbientLight(0xffffff, 0.7);
    directLight.position.set(10, 20, 0);
    this.scene.add(directLight);
    this.camera.position.set(5, 3, -3);

    window.addEventListener("resize", this.onWindowResize, false);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth / window.innerHeight);
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
    const spacebetweenCubes = 0.0; //0.05
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

  twoDigits(num){
    return Math.round(num * 100)/100
  }

  mapFaceToIndex() {
    const [minPos] = this.positions[0];
    const [maxPos] = this.positions[2];
    const x = 0;
    const y = 1;
    const z = 2;
    console.log(this.positions)
    this.positions.forEach((position, index) => {
      if (position[x] === minPos)
        this.faceToindex["left"][Math.abs(Math.floor(position[y]) - 1) % 3][
          Math.floor(position[z]) + 1
        ] = index;
      if (position[x] === maxPos)
        this.faceToindex["right"][Math.abs(Math.floor(position[y]) - 1)][
          Math.abs(Math.floor(position[z]) - 1)
        ] = index;
      if (position[y] === minPos)
        this.faceToindex["bottom"][Math.abs(Math.floor(position[z]) - 1) % 3][
          Math.floor(position[x]) + 1
        ] = index;
      if (position[y] === maxPos) {
        this.faceToindex["top"][Math.floor(position[z]) + 1][
          Math.floor(position[x]) + 1
        ] = index;
      }
      if (position[z] === minPos)
        this.faceToindex["back"][Math.abs(Math.floor(position[y]) - 1) % 3][
          Math.floor(position[x]) + 1
        ] = index;
      if (position[z] === maxPos) {
        this.faceToindex["front"][Math.abs(Math.floor(position[y]) - 1) % 3][
          Math.floor(position[x]) + 1
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
    const numOfFaces = 6;
    const Faces = { right: 0, left: 1, top: 2, bottom: 3, front: 4, back: 5 };

    const defaultColor = new THREE.MeshPhongMaterial({ color: "#1e1e1f" });
    let material = [];

    [...Array(numOfFaces)].forEach(() => material.push(defaultColor));

    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const visableFaces = this.indexToFaces[index];
    visableFaces.forEach((face) => {
      material[Faces[face]] = new THREE.MeshPhongMaterial({
        color: this.getCellsColor(face, index),
      });
    });

    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  getCellsColor(face, cubeIndex) {
    let row, col;
    this.faceToindex[face].forEach((val, r) => {
      for (let i = 0; i < this.faceToindex[face].length; i++) {
        if (this.faceToindex[face][r][i] === cubeIndex) {
          row = r;
          col = i;
          break;
        }
      }
    });

    return this.cubeLogic.getState()[face][row][col];
  }

  getCubeIndex(thisCubeId) {
    let val;
    this.cubes.forEach((cube, index) => {
      if (cube.id === thisCubeId) val = index;
    });
    return val;
  }

  createLayer(axis, rowNum) {
    const cubesInLayer = this.getCubeInLayer(axis, rowNum);
    let layer = new THREE.Group();
    cubesInLayer.forEach((index) => {
      console.log(index);
      layer.add(this.cubes[index]);
    });
    return layer;
  }

  getCubeInLayer(axis, rowNum) {
    let cubesInLayer = new Set();
    if (axis === "x") {
      globals.PLAINS[axis].forEach((plain) => {
        console.log(plain);
        this.faceToindex[plain][rowNum].forEach((index) => {
          cubesInLayer.add(index);
        });
      });
    } else if (axis === "y") {
      globals.PLAINS[axis].forEach((plain) => {
        if (plain === "bottom") {
          this.faceToindex[plain][rowNum].forEach((index) => {
            cubesInLayer.add(index);
          });
        } else if (plain === "top") {
          this.faceToindex[plain][globals.ROW_SIZE - 1 - rowNum].forEach(
            (index) => {
              cubesInLayer.add(index);
            }
          );
        } else if (plain === "left") {
          this.faceToindex[plain].forEach((row) => {
            cubesInLayer.add(row[globals.ROW_SIZE - 1 - rowNum]);
          });
        } else {
          this.faceToindex[plain].forEach((row) => {
            cubesInLayer.add(row[rowNum]);
          });
        }
      });
    } else {
      globals.PLAINS[axis].forEach((plain) => {
        this.faceToindex[plain].forEach((row) => {
          cubesInLayer.add(row[rowNum]);
        });
      });
    }
    return cubesInLayer;
  }

  getRowToRotate(cubeIndex, face, axis) {
    // do I need a row or a col?

    let rowNum;

    this.faceToindex[face].forEach((row, index) => {
      row.forEach((item) => {
        if (item === cubeIndex) rowNum = index;
      });
    });

    return rowNum;
  }

  disassembleLayer(layer) {
    this.scene.remove(layer);

    layer.forEach((box) => {
      this.scene.add(box);
    });
  }

  rotate(axis, rowNum, direction) {
    const layer = this.createLayer(axis, rowNum);
    this.scene.add(layer);
    // update index to face / face to index
    this.rotationAnimation(layer, axis, direction);
    //this.disassembleLayer(layer);
  }

  rotationAnimation(layer, axis, direction) {
    const DEGREE90 = 1.57;
    const step = 0.01;
    if (this.makeingMove) return;

    this.makeingMove = true;
    let angle = 0;
    if (direction === globals.DIRECTIONS.colckwise) angle = DEGREE90;
    else angle = -DEGREE90;

    let time = 0;
    let totalAngle = 0;
    function animateSpin(time) {
      if (
        (angle == DEGREE90 && totalAngle >= DEGREE90) ||
        (angle == -DEGREE90 && totalAngle >= 0)
      ) {
        this.makeingMove = false;
        return;
      }
      if (axis === "x") layer.rotateY(step);
      else if (axis === "y") layer.rotateZ(step);
      else layer.rotateX(step);
      totalAngle += step;
      requestAnimationFrame(() => animateSpin(time));
    }

    animateSpin(time);
  }
}
