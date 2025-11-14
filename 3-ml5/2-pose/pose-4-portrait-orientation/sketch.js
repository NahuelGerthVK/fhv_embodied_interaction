/* - - Variables - - */
let bodyPose;
let webcam;
let poses = [];

// smoothing
let activateSmoothing = true;
let smoothing = 0.4; // smaller = smoother

// webcam setup
const constraints = {
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: 16 / 9,
    facingMode: "user", // or "environment"
  },
  audio: false,
};

/* - - Preload - - */
function preload() {
  bodyPose = ml5.bodyPose("BlazePose", { flipped: true });
}

/* - - Setup - - */
function setup() {
  createCanvas(1080, 1920); // 9:16

  // scale factor
  coverSketch();

  // styling
  noStroke();

  // create webcam capture
  webcam = createCapture(constraints);
  webcam.hide();

  // start tracking
  bodyPose.detectStart(webcam, gotPoses);
}

/* - - Draw - - */
function draw() {
  background(0);

  // portrait mode adaptions
  push();
  translate(width / 2, height / 2); // move to screen center
  rotate(radians(90)); // rotate by 90°
  translate(-height / 2, -width / 2); // move back to top-left corner (after rotation)

  // draw webcam
  image(webcam, 0, 0, height, width);

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
        ellipse(keypoint.x, keypoint.y, 30);
      }
    }
  }

  // 2. draw specific keypoints

  // draw rectangle on nose
  for (let i = 0; i < poses.length; i++) {
    let nose = poses[i].keypoints[0]; // by number

    fill("red");
    rectMode(CENTER);
    rect(nose.x, nose.y, 40, 40);

    // text on nose
    push();
    fill(255);
    translate(nose.x, nose.y);
    rotate(radians(-90));
    noStroke();
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Nose", 0, 30);
    pop();
  }

  pop();
}

/* - - Resize - - */
function windowResized() {
  coverSketch();
}

/* - - Functions - - */

// pose tracking
function gotPoses(results) {
  // smoothing
  if (activateSmoothing) {
    if (poses.length > 0) {
      for (let i = 0; i < results.length; i++) {
        if (poses[i]) {
          let oldPose = poses[i];
          let newPose = results[i];
          for (let j = 0; j < newPose.keypoints.length; j++) {
            newPose.keypoints[j].x = lerp(
              oldPose.keypoints[j].x,
              newPose.keypoints[j].x,
              smoothing
            );
            newPose.keypoints[j].y = lerp(
              oldPose.keypoints[j].y,
              newPose.keypoints[j].y,
              smoothing
            );
          }
        }
      }
    }
  }

  poses = results; // array of tracked points
}

// helper: cover sketch to window
function coverSketch() {
  let scale;

  // get scale factors
  let scaleX = windowWidth / width;
  let scaleY = windowHeight / height;

  // use the bigger scale
  scale = max(scaleX, scaleY);

  // apply scale
  displayMode(NORMAL, SMOOTH, scale);
}
