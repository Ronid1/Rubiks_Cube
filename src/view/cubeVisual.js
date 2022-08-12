import * as THREE from "three";
import { Group } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as globals from "../logic/globals";

// https://www.youtube.com/watch?v=xJAfLdUgdc4
// https://github.com/filipw01/threejs-rubiks-cube/blob/master/RubiksCube.js
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
    //this.indexToFaces = {};
    this.faceToindex = { ...this.cubeLogic.getState() };

    //start game
    this.initiateScene();
    this.animate();
    this.initiateRubiks();
    this.mapFaceToIndex();
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
    this.camera.position.set(-1, 1, 7);

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
    const group = new THREE.Group();

    for (let index = 0; index < globals.ROW_SIZE ** globals.ROW_SIZE; index++) {
      let position = this.positions[index];
      let cube = this.initiateCube(index, position);
      cube.position.set(...position);
      group.add(cube);
    }

    this.scene.add(group);
  }

  initiateCubesPositions(cubeSize) {
    const spacebetweenCubes = 0.1;
    let cubesPositions = [];
    let mid = Math.floor(globals.ROW_SIZE / 2);

    for (let z = globals.ROW_SIZE - 1; z >= 0; z--) {
      for (let y = globals.ROW_SIZE - 1; y >= 0; y--) {
        for (let x = 0; x < globals.ROW_SIZE; x++) {
          cubesPositions.push([
            x * (cubeSize + spacebetweenCubes) - mid,
            y * (cubeSize + spacebetweenCubes) - mid,
            z * (cubeSize + spacebetweenCubes) - mid,
          ]);
        }
      }
    }
    console.log(cubesPositions);
    return cubesPositions;
  }

  mapFaceToIndex() {
    const [minPos] = this.positions[0];
    const [maxPos] = this.positions[2];
    const x = 0;
    const y = 1;
    const z = 2;

    this.positions.forEach((position, index) => {
      if (position[x] === minPos)
        this.faceToindex["left"][Math.floor(position[z]) + 1][
          Math.floor(position[y]) + 1
        ] = index;
      if (position[x] === maxPos)
        this.faceToindex["right"][Math.floor(position[z]) + 1][
          Math.floor(position[y]) + 1
        ] = index;
      if (position[y] === minPos)
        this.faceToindex["top"][Math.floor(position[z]) + 1][
          Math.floor(position[x]) + 1
        ] = index;
      if (position[y] === maxPos)
        this.faceToindex["bottom"][Math.floor(position[z]) + 1][
          Math.floor(position[x]) + 1
        ] = index;
      if (position[z] === minPos)
        this.faceToindex["front"][Math.floor(position[x]) + 1][
          Math.floor(position[y]) + 1
        ] = index;
      if (position[z] === maxPos)
        this.faceToindex["back"][Math.floor(position[x]) + 1][
          Math.floor(position[y]) + 1
        ] = index;
    });
    console.log(this.faceToindex);
  }

  initiateCube(index, position) {
    const DIMENTIONS = 1;
    const Faces = ["right", "left", "top", "bottom", "front", "back"];

    const defaultColor = new THREE.MeshPhongMaterial({ color: "black" });

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    let material;

    if (Math.floor(position[2]) === -1)
      material = new THREE.MeshPhongMaterial({ color: "green" });
    else if (Math.floor(position[2]) === 0)
      material = new THREE.MeshPhongMaterial({ color: "blue" });
    else material = new THREE.MeshPhongMaterial({ color: "white" });
    //[right, left, top, bottom, front, back]
    const cube = new THREE.Mesh(geometry, material);

    return cube;
  }

  // TO DO: might not use
  // mapIndexToFace() {
  //   const [minPos] = this.positions[0];
  //   const [maxPos] = this.positions[2];
  //   const x = 0;
  //   const y = 1;
  //   const z = 2;
  //   this.positions.forEach((position, index) => {
  //     let faces = [];
  //     if (position[x] === minPos) faces.push("left");
  //     if (position[x] === maxPos) faces.push("right");
  //     if (position[y] === minPos) faces.push("top");
  //     if (position[y] === maxPos) faces.push("bottom");
  //     if (position[z] === minPos) faces.push("front");
  //     if (position[z] === maxPos) faces.push("back");

  //     this.indexToFaces[index] = faces;
  //   });
  // }
}
