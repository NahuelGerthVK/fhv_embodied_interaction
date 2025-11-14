/* - - Variables - - */
let reveal; // This is the layer we want to reveal
let mask; // This is the mask

/* - - Setup - - */
function setup() {
  createCanvas(600, 600);

  // Initial styling
  noStroke();

  // Create the reveal layer
  reveal = createGraphics(width, height);
  reveal.textSize(500);
  reveal.textAlign(CENTER, CENTER);
  reveal.fill(255);
  reveal.text("Hello", width / 2, height / 2);

  // Create the mask layer
  mask = createGraphics(width, height);
}

/* - - Draw - - */
function draw() {
  background(0);

  // Empty the mask
  mask.clear();
  mask.background(255, 255); // show everything

  // hide with cursor
  mask.blendMode(REMOVE); // overlapping pixels are removed by making them completely transparent
  mask.fill(255, 255); // 255 = fully visible
  mask.ellipse(mouseX, mouseY, 200, 200); // Ellipse hides the area
  mask.blendMode(BLEND); // reset blend mode

  // Make a copy of the reveal layer and apply the mask
  let visible = reveal.get();
  visible.mask(mask); // Apply the mask to the reveal layer

  // Draw the visible (masked) image on the canvas
  image(visible, 0, 0);
}
