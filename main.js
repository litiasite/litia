import * as THREE from 'https://cdn.skypack.dev/three@0.133.1/build/three.module.js';
gsap.registerPlugin(ScrollTrigger);
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/loaders/GLTFLoader.js';
const hdrTextureURL = new URL('assets/Immagini/brown_photostudio_07_1k.hdr', import.meta.url); 
const scene = new THREE.Scene();


let specta;
let basetta;
let movelights = {value: 1};
let video = document.querySelector(".video-scrub")
let loading = document.querySelector(".loading");
let camera;

var mobileX = window.matchMedia("(max-width: 768px)")

let loadingTl = gsap.timeline({
  defaults : {
    ease: "power2.out",
    duration: 2
  }  
});



  loadingTl.to(".loading-rect", {width:"12vh", height: "12vh"})
  loadingTl.call(loop)


let iphoneTex = "wave";

const toLoad = [
  {name: "specta", file: "assets/specta/Specta.gltf", group: new THREE.Group()},
  {name: "basetta", file: "assets/basetta/basetta.gltf", group: new THREE.Group()},
  {name: "iphone", file: "assets/dispositivi/iphone/scene.gltf", group: new THREE.Group()},
  {name: "mac", file: "assets/dispositivi/macbook/Macbook.gltf", group: new THREE.Group()},
  {name: "tv", file: "assets/dispositivi/tv/tv.gltf", group: new THREE.Group()}
]

const models = {};

const LoadingManager = new THREE.LoadingManager

LoadingManager.onLoad = setupAnimation;

const gltfLoader = new GLTFLoader(LoadingManager)
const textureLoader = new THREE.TextureLoader(LoadingManager)
const hdriloader = new RGBELoader(LoadingManager);

var appTex = textureLoader.load('assets/dispositivi/iphone/textures/ekran_baseColor_1.png');
var waveTex = textureLoader.load('assets/dispositivi/iphone/textures/ekran_baseColor.png');

toLoad.forEach(item=>{
  gltfLoader.load(item.file, (model)=>{
    model.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
      }
    })
    item.group.add(model.scene)
    item.group.scale.set(10, 10, 10)
    scene.add(item.group);
    models[item.name] = item.group 
  })
}) 


//sizes 
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let sizes = {
  width : window.innerWidth,
  height : window.innerHeight * 1.1,
  scale: clamp( 1 + window.innerWidth * 0.01 , 5.5 ,10),
  camera: clamp( 65 - window.innerWidth * 0.04, 25, 50)
} 


//lights

const startRightLight = new THREE.DirectionalLight( 0xffffff , 0.5 );
startRightLight.position.set( 10, 10, -10 );
startRightLight.castShadow = true
startRightLight.shadow.bias = -0.01;
startRightLight.shadow.mapSize.width = 2048
startRightLight.shadow.mapSize.height = 2048
startRightLight.shadow.camera.near = 1.0
startRightLight.shadow.camera.far = 500
startRightLight.shadow.camera.left = 200
startRightLight.shadow.camera.right = -200
startRightLight.shadow.camera.top = 200
startRightLight.shadow.camera.bottom = -200

const startLeftLight = new THREE.DirectionalLight( 0xffffff , 0.5 );
startLeftLight.position.set( -10, -10, -10 );
startLeftLight.castShadow = true
startLeftLight.shadow.bias = -0.01;
startLeftLight.shadow.mapSize.width = 2048
startLeftLight.shadow.mapSize.height = 2048
startLeftLight.shadow.camera.near = 1.0
startLeftLight.shadow.camera.far = 500
startLeftLight.shadow.camera.left = 200
startLeftLight.shadow.camera.right = -200
startLeftLight.shadow.camera.top = 200
startLeftLight.shadow.camera.bottom = -200


scene.add( startRightLight, startLeftLight );

//hdri
hdriloader.load(hdrTextureURL, function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
})

//camera
camera = new THREE.PerspectiveCamera(40, sizes.width/sizes.height, 0.1, 200);

camera.position.set(0, 0, sizes.camera);
let cameraTarget = new THREE.Vector3(0, 0, 0)
scene.add(camera);


//render

const renderer = new THREE.WebGLRenderer({alpha:true});
const container = document.querySelector('.canvas-container');
container.appendChild( renderer.domElement )
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio)
if(mobileX.matches) {
  renderer.setPixelRatio(window.devicePixelRatio * 0.7);
}
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;


function loop() {

  camera.lookAt(cameraTarget)
  renderer.render(scene, camera); 
  requestAnimationFrame(loop);

  startRightLight.position.y = movelights.value *  10 * Math.cos(Date.now() / 2000);
  startRightLight.position.x = movelights.value *  10 * Math.sin(Date.now() / 2000);
  startLeftLight.position.y = -movelights.value *  10 * Math.cos(Date.now() / 2000);
  startLeftLight.position.x = -movelights.value *  10 * Math.sin(Date.now() / 2000);
  
}

function mapRange (value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  let newValue = c + value * (d - c);

  if (newValue < c) { return c}
  if (newValue > d) { return d}
  else {return newValue}
}


function setupAnimation(){

  specta = models.specta
  basetta = models.basetta
  specta.children[0].children[0].material.envMapIntensity = 0
  basetta.children[0].children[0].material.envMapIntensity = 0

  specta.position.set( 0, -7, mapRange(sizes.width, 1000, 400, 3, 22));
  specta.rotation.set(1.7, -0.12, 0);
  basetta.position.set(0, -40, 0);

  models.iphone.scale.set(mapRange(sizes.width, 400, 1000, 4.5, 7),mapRange(sizes.width, 400, 1000, 4.5, 7),mapRange(sizes.width, 400, 1000, 4.5, 7))
  models.mac.scale.set(mapRange(sizes.width, 400, 1000, 4.5, 7),mapRange(sizes.width, 400, 1000, 4.5, 7),mapRange(sizes.width, 400, 1000, 4.5, 7))
  models.tv.scale.set(mapRange(sizes.width, 400, 1000, 10, 25), mapRange(sizes.width, 400, 1000, 10, 25), mapRange(sizes.width, 400, 1000, 10, 25))

  models.mac.position.set(100, -10, -60)
  models.tv.position.set(-100, -10, -60)
  models.iphone.position.set(0, 30, 20)

  models.mac.rotation.y = 1.57
  models.tv.rotation.y = -1.57
  models.iphone.rotation.x = -2

  models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.envMapIntensity = 0;
  //console.log(models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map)

  if(mobileX.matches){ mobileAnimation() }
  else {desktopAnimation()}

  setTimeout(() => {
    loading.classList.add("inactive")
    loadingTl.to(".loading", {"display": "none"})
  }, 2000);
  

}

function desktopAnimation() {  

  const tl = gsap.timeline({
    defaults : {
      ease: "power2.inOut",
      duration: 2
    },
    scrollTrigger: {
      trigger: ".page",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    }

  
  });

  let section = 0;

  //comparsa
  tl.to(movelights, {value: 0}, section)
  tl.to(startLeftLight, {intensity: 0}, '<')
  tl.to(startRightLight, {intensity: 0}, '<')

  tl.to(specta.children[0].children[0].material, {envMapIntensity: 1}, '<')
  tl.to(basetta.children[0].children[0].material, {envMapIntensity: 1}, '<')

 
  //si appoggia sulla basetta
  tl.to(specta.rotation, {x:0, y: 1.57, z:0}, section)
  tl.to(specta.position, {x:0, y:-2.05, z:0}, '<')
  tl.to(basetta.position, {x:0, y:-5, z:0}, '<')
  tl.from("body", {backgroundColor: "black"}, '<')
  tl.from(".specta", {y: "100vh", duration:1}, section+1)
  section += 2;
  
  //ruota per far spazio al testo
  tl.to(specta.position, {x:4, y:-1}, section+0.5)
  tl.to(basetta.position, {x:4, y:-4.05}, '<')
  tl.to(".specta", {y: "-100vh", duration:1}, section+0.5)
  tl.from(".personal-silencer", {y:"2vh", opacity:0, duration: 1}, section+1)
  section +=2
  
  //sale coperta dal video
  tl.to(specta.position, {y:1}, section+0.5)
  tl.to(basetta.position, {y:-1.05}, '<')
  tl.to(".personal-silencer", {y:"-10vh", opacity:0}, '<')
  tl.from(".video-container", {y: "100vh"}, '<')
  /* tl.add(function() {video.play()}, section) */
  section += 2;
  
  //in posizione per dopo il video
  tl.to(specta.rotation, {x:-3, y:-0.12}, section)
  tl.to(basetta.position, {x:0, y:-0.5, z:-2}, '<')
  tl.to(basetta.rotation, {x:0, y:0}, '<')
  section +=2;

  //la basetta scende 
  tl.to(basetta.rotation, {x:1.57, y:1.57}, section)
  tl.to(specta.position, {x:0, y:20, z:0}, '<')
  tl.to(basetta.position, {x:5, y: 0.5}, '<')
  tl.to(".video-container", {y: "-100vh"}, '<')
  /* tl.add(function() {video.pause()}, section) */
  tl.from(".plug-and-play", {y:"2vh", opacity:0, duration: 1}, section+1)
  section +=2

  //la basetta va in centro e entrano i dispositivi
  tl.to(basetta.position, {x:0, y:-18, z:-50}, section)
  tl.to(".plug-and-play", {y:"-2vh", opacity:0, duration: 1}, '<')
  tl.to(basetta.rotation, {x:0, y:0, z:0}, '<')
  tl.to(specta.position, {x:0, y:-15, z:-50}, '<')
  tl.to(specta.rotation, {x:0, y:0, z:0}, '<')
  tl.to(models.mac.position, {x:30}, '<')
  tl.to(models.mac.rotation, {y:-0.5}, '<')
  tl.to(models.tv.position, {x:-30}, '<')
  tl.to(models.tv.rotation, {y:0.5}, '<')
  tl.to(models.iphone.position, {z:-60, y:2, duration: 1.5}, section + 0.5)
  tl.to(models.iphone.rotation, {x:0, duration: 1.5}, '<')
  tl.from(".all-devices", {y:"2vh", opacity:0, duration: 1}, '<')
  section +=2

  //il telefono viene avanti per mostrare l'app
  tl.to(models.iphone.position, {x:-18, y:1, z:-20}, section)
  tl.to(models.iphone.rotation, {y:7.28, x:-0.2, z:0.3}, section)
  tl.to(models.mac.position, {x:100}, '<')
  tl.to(models.mac.rotation, {y:1.57}, '<')
  tl.to(models.tv.position, {x:-100}, '<')
  tl.to(models.tv.rotation, {y:-1.57}, '<')
  tl.to(basetta.position, {y:-40}, '<')
  tl.to(specta.position, {y:-37, z:0}, '<')
  tl.to(".all-devices", {y:"-2vh", opacity:0, duration: 1}, '<')
  tl.from(".app", {y:"2vh", opacity:0, duration: 1}, section + 0.5)
  tl.add(function() {

    waveTex.flipY = false;

      if(iphoneTex == "app") {
        iphoneTex = "wave";
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map = waveTex;
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.emissiveMap = waveTex;
        //console.log(models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map)
    }
      else {
        iphoneTex = "app"
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map = appTex;
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.emissiveMap = appTex;
        //console.log(models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map)
      }
    }

  , section+1) 
  section +=2

//telefono esce
  tl.to(".app", {y:"-80vh", opacity: 0}, section);
  tl.to(models.iphone.position, {y: 40, duration: 1.5}, section + 0.5);

//due colorazioni
  tl.to(specta.rotation, {x:1.7, y:-0.12, z:0}, section)
  tl.to(specta.position, {x:0, y:2, z:-5},'<')
  tl.from(".buynow", {y:"100vh", delay: 0.3}, '<')
  section+=2; 

  tl.to(specta.position, {y: 4, duration: 0.5}, section + 0.5)
  tl.to(".buynow", {y: "-10vh", duration: 0.5}, '<')
  tl.from("footer", {y: "120%", duration: 0.5}, '<')
}

function mobileAnimation() {  


  const tl = gsap.timeline({
    defaults : {
      ease: "power2.inOut",
      duration: 2
    },
    scrollTrigger: {
      trigger: ".page",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    }

  
  });

  let section = 0;

  //comparsa
  tl.to(movelights, {value: 0}, section)
  tl.to(startLeftLight, {intensity: 0}, '<')
  tl.to(startRightLight, {intensity: 0}, '<')

  tl.to(specta.children[0].children[0].material, {envMapIntensity: 1}, '<')
  tl.to(basetta.children[0].children[0].material, {envMapIntensity: 1}, '<')

 
  //si appoggia sulla basetta
  tl.to(specta.rotation, {x:0, y:1.57, z:0}, section)
  tl.to(specta.position, {x:0, y:-2.55, z:0}, '<')
  tl.to(basetta.position, {x:0, y:-5.5, z:0}, '<')
  tl.from("body", {backgroundColor: "black"}, '<')
  tl.from(".specta", {y: "70vh", duration:1}, section+1)
  section += 2;
  
  //sale per far spazio al testo
  tl.to(specta.position, { y:4.5}, section+0.5)
  tl.to(basetta.position, { y:1.55}, '<')
  tl.to(".specta", {y: "-60vh", duration:1}, section+0.5)
  tl.from(".personal-silencer", {y:"2vh", opacity:0, duration: 1}, section+1)
  section +=2
  
  //sale coperta dal video
  tl.to(specta.position, {y:7}, section+0.5)
  tl.to(basetta.position, {y:4.55}, '<')
  tl.to(".personal-silencer", {y:"-10vh", opacity:0}, '<')
  tl.from(".video-container", {y: "100vh"}, '<')
  section += 2;
  
  //in posizione per dopo il video
  tl.to(specta.rotation, {x:-3, y:-0.12}, section)
  tl.to(basetta.position, {x:0, y:-0.5, z:-2}, '<')
  tl.to(basetta.rotation, {x:0, y:0}, '<')
  section +=2;

  //la basetta scende 
  tl.to(basetta.rotation, {x:1.57, y:1.57}, section)
  tl.to(basetta.position, {x:0, y: 7, z: -15}, '<')
  tl.to(".video-container", {y: "-100vh"}, section - 1)
  tl.to(specta.position, {x:0, y:30, z:0}, '<')
  tl.from(".plug-and-play", {y:"2vh", opacity:0, duration: 1}, section+1)
  section +=2


  //la basetta va in centro e entrano i dispositivi
  tl.to(basetta.position, {x:0, y:-21, z:-40}, section)
  tl.to(".plug-and-play", {y:"5vh", opacity:0, duration: 1}, '<')
  tl.to(basetta.rotation, {x:0, y:0, z:0}, '<')
  tl.to(specta.position, {x:0, y:-18, z:-40}, '<')
  tl.to(specta.rotation, {x:0, y:0, z:0}, '<')
  tl.to(models.mac.position, {x:16, y: -10, z: -100}, '<')
  tl.to(models.mac.rotation, {y:0.8}, '<')
  tl.to(models.tv.position, {x:-8, y: -6,  z: -40}, '<')
  tl.to(models.tv.rotation, {y:-0.8}, '<')
  tl.to(models.iphone.position, {z:-60, y:-3, duration: 1.5}, section + 0.5)
  tl.to(models.iphone.rotation, {x:0, duration: 1.5}, '<')
  tl.from(".all-devices", {y:"2vh", opacity:0, duration: 1}, '<')
  section +=2

  //il telefono viene avanti per mostrare l'app
  tl.to(models.iphone.position, {x:0, y:7, z:0}, section)
  tl.to(models.iphone.rotation, {y:6.28}, section)
  tl.to(models.mac.position, {x:100}, '<')
  tl.to(models.mac.rotation, {y:1.57}, '<')
  tl.to(models.tv.position, {x:-100}, '<')
  tl.to(models.tv.rotation, {y:-1.57}, '<')
  tl.to(basetta.position, {y:-55}, '<')
  tl.to(specta.position, {y:-52}, '<')
  tl.to(".all-devices", {y:"-2vh", opacity:0, duration: 1}, '<')
  tl.from(".app", {y:"2vh", opacity:0, duration: 1}, section + 0.5)
  tl.add(function() {

    waveTex.flipY = false;

      if(iphoneTex == "app") {
        iphoneTex = "wave";
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map = waveTex;
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.emissiveMap = waveTex;
    }
      else {
        iphoneTex = "app"
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.map = appTex;
        models.iphone.children[0].children[0].children[0].children[0].children[0].children[3].children[5].material.emissiveMap = appTex;
      }
    }

  , section+1) 
  section +=2

//telefono esce
  tl.to(".app", {y:"-80vh", opacity: 0}, section);
  tl.to(specta.position, {z:15}, section - 1 )
  tl.to(models.iphone.position, {y: 70, duration: 1.5}, section + 0.2);
  
//due colorazioni
  tl.to(specta.rotation, {x:1.7, y:-0.12, z:0}, section)
  tl.to(specta.position, {x:0, y:2, z:15},'<')
  tl.from(".buynow", {y:"40vh", delay: 0.3}, '<')
  
  
  section+=2; 
  tl.to(specta.position, {y: 4, duration: 0.5}, section + 0.5)
  tl.to(".buynow", {y: "-10vh", duration: 0.5}, '<')
  tl.from("footer", {y: "120%", duration: 0.5}, '<')
}


window.addEventListener( 'resize', onWindowResize, false);

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight ;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


ScrollTrigger.create({
  trigger: ".secvideo",
  onEnter: () => video.play(),
  onEnterBack: () => video.play(),
  onLeave: () => video.pause(),
  onLeaveBack: () => video.pause(),
  start: "center 90%"
});










