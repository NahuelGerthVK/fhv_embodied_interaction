/* - - Variables - - */
let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };
let webcam;
let faces = [];

// useful face points:
// https://storage.googleapis.com/mediapipe-assets/documentation/mediapipe_face_landmark_fullsize.png
// 4 = nose tip
// 13 = upper lip
// 14 = lower lip
// 310 = mouth left corner
// 78 = mouth right corner
// 473 = left eye
// 468 = right eye

/* - - Preload - - */
function preload() {
  faceMesh = ml5.faceMesh(options);
}

/* - - Setup - - */
function setup() {
  createCanvas(1920, 1080); // 16:9

  // move canvas to center, fit into window, scale 1x
  displayMode(MAXED, SMOOTH, 1);

  // styling
  noStroke();

  // create webcam capture
  webcam = createCapture({
    video: { width: width, height: height },
  });
  webcam.hide();

  // start tracking
  faceMesh.detectStart(webcam, gotFaces);
}

/* - - Draw - - */
function draw() {
  background(0);

  // webcam
  image(webcam, 0, 0, width, height);

  // 1. draw all keypoints

  // 1.1  iterate through all detected people
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    // 1.2 iterate through all keypoints
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];

      // draw points
      fill(255);
      stroke(0);
      strokeWeight(3);
      ellipse(keypoint.x, keypoint.y, 10);
    }
  }

  // 2. draw specific keypoints

  // draw rectangle on nose
  for (let i = 0; i < faces.length; i++) {
    // let nose = faces[i].nose; // by name
    let nose = faces[i].keypoints[4]; // by number

    fill("red");
    rectMode(CENTER);
    rect(nose.x, nose.y, 20, 20);
  }
}

/* - - Functions - - */

// face tracking
function gotFaces(results) {
  faces = results; // array of tracked points
  //console.log(faces);
}
