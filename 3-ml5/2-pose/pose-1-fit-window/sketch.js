/* - - Variables - - */
let handPose;
let webcam;
let poses = [];

/* - - Preload - - */
function preload() {
  bodyPose = ml5.bodyPose({
    enableSmoothing: true,
    flipped: true,
    runtime: "mediapipe", // seems to be more stable than "tfjs"
  });
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
  bodyPose.detectStart(webcam, gotPoses);
}

/* - - Draw - - */
function draw() {
  background(0);

  // webcam
  image(webcam, 0, 0, width, height);

  // 1. draw all keypoints

  // 1.1  iterate through all detected people
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];

    // 1.2 iterate through all keypoints
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];

      // confidence score
      if (keypoint.confidence > 0.1) {
        fill(255);
        stroke(0);
        strokeWeight(3);
        ellipse(keypoint.x, keypoint.y, 10);
      }
    }
  }

  // 2. draw specific keypoints

  // draw rectangle on nose
  for (let i = 0; i < poses.length; i++) {
    // let nose = poses[i].nose; // by name
    let nose = poses[i].keypoints[0]; // by number

    fill("red");
    rectMode(CENTER);
    rect(nose.x, nose.y, 20, 20);
  }
}

/* - - Functions - - */

// hand tracking
function gotPoses(results) {
  poses = results; // array of tracked points
  //console.log(poses);
}
