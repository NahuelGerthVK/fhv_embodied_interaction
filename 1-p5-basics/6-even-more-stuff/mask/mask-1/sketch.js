/* - - Variables - - */
let reveal; // this is the layer we want to reveal
let mask; // this is the mask

/* - - Setup - - */
function setup() {
  createCanvas(600, 600);

  // initial styling
  noStroke();

  // create the reveal layer
  reveal = createGraphics(width, height);
  reveal.textSize(500);
  reveal.textAlign(CENTER, CENTER);
  reveal.fill(255);
  reveal.text("Hello", width / 2, height / 2);

  // create the mask layer
  mask = createGraphics(width, height);
}

/* - - Draw - - */
function draw() {
  background(0);

  // empty the mask
  mask.clear();
  mask.fill(255, 255); // full opacity = visible!
  mask.noStroke();
  mask.ellipse(mouseX, mouseY, 200, 200); // ellipse positive mask on our mouse

  // make a copy of the reveal layer and apply the mask
  let visible = reveal.get();
  visible.mask(mask);
  image(visible, 0, 0);
}
