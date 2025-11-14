/* - - Variables - - */
let handPose;
let webcam;
let hands = [];

// smoothing
let activateSmoothing = true;
let smoothing = 0.9; // smaller = smoother

/* - - Preload - - */
function preload() {
  handPose = ml5.handPose({ flipped: true, maxHands: 2 });
}

/* - - Setup - - */
function setup() {
  createCanvas(1920, 1080); // 16:9

  // scale factor
  coverSketch();

  // styling
  noStroke();

  // create webcam capture
  webcam = createCapture({
    video: { width: width, height: height },
  });
  webcam.hide();

  // start tracking
  handPose.detectStart(webcam, gotHands);
}

/* - - Draw - - */
function draw() {
  background(0);

  // webcam
  image(webcam, 0, 0, width, height);

  // draw all hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];

      if (hand.handedness === "Left") {
        fill(255, 0, 0);
      } else {
        fill(0, 0, 255);
      }
      strokeWeight(3);
      stroke(0);
      ellipse(keypoint.x, keypoint.y, 20);
    }
  }

  // draw specific points
  for (let i = 0; i < hands.length; i++) {
    // select hand
    let hand = hands[i];

    // get index finger
    let index = hand.index_finger_tip;

    // left hand
    if (hand.handedness === "Left") {
      // rect
      fill(0, 255, 0);
      strokeWeight(3);
      stroke(0);
      rectMode(CENTER);
      rect(index.x, index.y, 30, 30);

      // text
      fill(255);
      noStroke();
      textAlign(LEFT, CENTER);
      textSize(60);
      text("left", index.x + 30, index.y);
    }

    // right hand
    else {
      // rect
      fill(255, 255, 0);
      strokeWeight(3);
      stroke(0);
      rectMode(CENTER);
      rect(index.x, index.y, 30, 30);

      // text
      fill(255);
      noStroke();
      textAlign(RIGHT, CENTER);
      textSize(60);
      text("right", index.x - 30, index.y);
    }
  }
}

/* - - Resize - - */
function windowResized() {
  coverSketch();
}

/* - - Functions - - */

// hand tracking
function gotHands(results) {
  // smoothing
  if (activateSmoothing) {
    if (hands.length > 0) {
      for (let i = 0; i < results.length; i++) {
        if (hands[i]) {
          let oldHand = hands[i];
          let newHand = results[i];
          for (let j = 0; j < newHand.keypoints.length; j++) {
            newHand.keypoints[j].x = lerp(
              oldHand.keypoints[j].x,
              newHand.keypoints[j].x,
              smoothing
            );
            newHand.keypoints[j].y = lerp(
              oldHand.keypoints[j].y,
              newHand.keypoints[j].y,
              smoothing
            );
          }
        }
      }
    }
  }

  hands = results; // array of tracked points
  //console.log(hands);
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
