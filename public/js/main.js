//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


const responses = [
  "Yes",
  "No",
  "Maybe",
  "Ask again later",
  "Outlook not so good",
  "Definitely",
  "Absolutely not"
];

document.addEventListener("DOMContentLoaded", () => {
  const getResponseBtn = document.getElementById("getResponseBtn");
  const responseContainer = document.getElementById("responseContainer");

  getResponseBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * responses.length);
    const randomResponse = responses[randomIndex];

    // Display the response to the user
    responseContainer.innerText = randomResponse;
  });
});

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'eight_ball';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },

  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "eight_ball" ? 10 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "eight_ball" ? 5 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "eight_ball") {
    controls = new OrbitControls(camera, renderer.domElement);
  }
  
  let rotationX = 0;
  let rotationY = 0;

  //Render the scene
  function animate() {
    requestAnimationFrame(animate);

    //rotationX += 0.001;
    rotationY += 0.002;
    //Here we could add some code to update the scene, adding some automatic movement

//Make the eye move
if (object && objToRender === "eight_ball") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    object.rotation.y = rotationY;
    //object.rotation.x = rotationX;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  //add mouse position listener, so we can make the eye move
 //   document.onmousemove = (e) => {
 //   mouseX = e.clientX;
 //   mouseY = e.clientY;
 // }
  //let isMousePressed = false;

  let isMousePressed = false;


// Add a listener for mouse button down
document.addEventListener("mousedown", () => {
  isMousePressed = true;
});

// Add a listener for mouse button up
document.addEventListener("mouseup", () => {
  isMousePressed = false;
});

// Add mouse position listener, but only update when the mouse button is pressed
document.addEventListener("mousemove", (e) => {
  if (isMousePressed) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
});

// Add a listener for mouse button down
document.addEventListener("mousedown", () => {
  isMousePressed = true;
});

  
  //Start the 3D rendering
  animate();

