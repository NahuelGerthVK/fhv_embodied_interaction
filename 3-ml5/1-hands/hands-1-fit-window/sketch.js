/* - - Variables - - */
let handPose;
let webcam;
let hands = [];

/* - - Preload - - */
function preload() {
  handPose = ml5.handPose({ flipped: true, maxHands: 2 });
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
      fill("red");
      noStroke();
      ellipse(keypoint.x, keypoint.y, 10);
    }
  }

  // draw ellipse on thumb
  if (hands.length > 0) {
    // select thumb tip of first hand
    let thumb = hands[0].thumb_tip; // by name
    // let thumb = hands[0].keypoints[4]; // by number

    fill("blue");
    ellipse(thumb.x, thumb.y, 20);
  }
}

/* - - Functions - - */

// hand tracking
function gotHands(results) {
  hands = results; // array of tracked points
  //console.log(hands);
}
