let myShader;
let img;
let noiseImg;
let video;
let clicked = false; //variabile che attiva o disattiva la distorsione dell'immagine (corrisponde all'alzare o abbassare il dispositivo che abbiamo pensato). Con un click diventa true, con il successivo false e così via
let stretch = 0; //variabile che va da 0 a 1, che passata allo shader determina lo stretch
let stretchcounter = 0; //come un framecount ma solo per determinare la durata dell'animazione di stretch
let distortcounter = 0; //come un framecount ma solo per determinare la durata dell'animazione di distorsione sinusoidale

let whiteNoise;
let freq = 0;
let amp = 0;
let xpos = 0;

let morphing = false;
let r;
let b = "waiting";

let myAngleX = 0;
let myAngleY = 0;
let myAngleZ = 0;

let clickedArray = [];
let angleArray;
let baseAngleZ = 0;
let luce_basetta;

//http://172.20.10.8/ specta
//http://172.20.10.13/ basetta
let api_url = "http://172.20.10.13/";
let api_url_basetta = "http://172.20.10.2/";

function preload() {
  myShader = loadShader("try/shader/shader.vert", "try/shader/shader.frag");
  video = createVideo(["try/assets/principale.mp4"], vidLoad);
  //video = loadImage('img.jpg');
  noiseImg = loadImage("try/assets/noiseTexture.png");
  whiteNoise = createAudio(""); //whitenoise-short.mp3
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  video.hide(); //nasconde il video, altrimenti p5 lo mostrerebbe sotto
  whiteNoise.loop();

  shader(myShader);

  myShader.setUniform("tex", video);
  myShader.setUniform("noiseTex", noiseImg);
  myShader.setUniform("screenWidth", width);
  myShader.setUniform("screenHeight", height);

  noStroke();
  noCursor();
}

function vidLoad() {
  video.loop();
}

function keyPressed() {}

function draw() {
  video.volume(1 - stretch);
  whiteNoise.volume(stretch);

  fetch(api_url).then((response) => {
    response.text().then((r) => {
      //console.log(r);

      angleArray = r.split(" ");

      myAngleX = +angleArray[0];
      myAngleY = +angleArray[1];
      myAngleZ = +angleArray[2] - baseAngleZ;

      // console.log(myAngleX);
      // console.log(myAngleY);
      // console.log(myAngleZ);
    });
  });

  //console.log(b);

  if (luce_basetta > 100 && clicked == false) {
    clicked = true;
    morphing = true;
    // console.log(b);
  } else if (luce_basetta <= 100 && morphing == false) {
    morphing = true;
    clicked = false;
  }

  clickedArray.push(clicked);

  if (clickedArray.length > 2) {
    clickedArray.shift();
  }

  if (clickedArray[0] == false && clickedArray[1] == true) {
    baseAngleZ = +angleArray[2];
    //console.log(baseAngleZ);
  }

  let ineasing = 0.01;
  let outeasing = 0.02;

  let goalfreq; //frequenza che l'onda deve raggiungere quando clicco
  let goalamp; //stesso ma per l'altezza (amplitude) dell'onda

  //r = "10 50 30";

  //console.log(r);

  let amplitudeAngle = -myAngleX;
  let xposangle = myAngleZ;

  if (clicked == true) {
    //accensione dispositivo
    stretchcounter = stretchcounter + 1; //aumento del tempo di stretch
    stretch = stretchcounter * 0.005; //con esso aumenta anche la variabile stretch, finchè non arriva a 1

    if (stretch > 1) {
      //solo dopo che l'immagine è totalmente stretchata, esegui
      morphing = false;
      stretch = 1;
      stretchcounter = stretch / 0.005; //fa si che il counter non continui ma rimanga fisso al valore che porta allo stretch massimo (1/0.005 = 200)

      distortcounter += 0.005; //ora che l'immagine è stretchata, parte il counter di tempo della distorsione sinusoidale

      goalfreq = 1.5 * sin(frameCount * 0.001) + 3;
      goalamp = map(amplitudeAngle, -90, 90, -1.0, 1.0, true); //l'altezza a cui arrivare dipende dalla mouseX
      goalxpos = map(xposangle, -180, 180, -15.0, 15.0);

      let d_freq = goalfreq - freq;
      freq += d_freq * ineasing;

      let d_amp = goalamp - amp;
      //ineasing = map(abs(d_amp), 0, 0.5, 0.05, 0.005, true)
      amp += d_amp * ineasing;

      let d_xpos = goalxpos - xpos;
      xpos += d_xpos * ineasing;

      myShader.setUniform("frequency", freq);
      myShader.setUniform("amplitude", amp);
      myShader.setUniform("xpos", xpos);

      if (distortcounter > 1) {
        distortcounter = 1;
      }
    }
  } else if (clicked == false) {
    //spegnimento dispositivo

    distortcounter -= 0.005; //diminuisce fino ad arrivare a 0 per diminuire la distorsione sinusoidale

    goalfreq = 0;
    goalamp = 0;

    let d_freq = goalfreq - freq;
    freq += d_freq * outeasing;

    let d_amp = goalamp - amp;
    amp += d_amp * outeasing;

    myShader.setUniform("frequency", freq);
    myShader.setUniform("amplitude", amp);

    if (distortcounter < 0.2) {
      //quando la distorsione è finita, esegui
      distortcounter = 0;

      if (stretch != 0) {
        //destretcha fino a che non torna alla situazione iniziale
        stretchcounter -= 1;
        stretch = stretchcounter * 0.005;
      }

      if (stretch < 0) {
        stretch = 0;
      }
    }
  }

  myShader.setUniform("stretch", stretch);
  myShader.setUniform("time", frameCount * 0.001);
  myShader.setUniform("distortcounter", distortcounter);

  rect(0, 0, width, height);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

setInterval(function () {}, 200);

setInterval(function () {
  fetch(api_url_basetta).then((response) => {
    response.text().then((b) => {
      luce_basetta = b;
      console.log(luce_basetta);
    });
  });
}, 200);
