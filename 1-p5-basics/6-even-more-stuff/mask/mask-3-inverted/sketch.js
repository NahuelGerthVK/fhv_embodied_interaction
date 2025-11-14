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

  // hide with cursor
  mask.fill(0, 255); // 255 = fully visible
  mask.ellipse(mouseX, mouseY, 200, 200); // Ellipse hides the area

  // now we simply invert the opacity of all pixels on the mask
  invertMaskOpacity(mask);

  // Make a copy of the reveal layer and apply the mask
  let visible = reveal.get();
  visible.mask(mask); // Apply the mask to the reveal layer

  // Draw the visible (masked) image on the canvas
  image(visible, 0, 0);
}

// Function to invert the opacity of all pixels in the mask
function invertMaskOpacity(mask) {
  mask.loadPixels();

  for (let i = 0; i < mask.pixels.length; i += 4) {
    // Invert the alpha channel (4th element in pixels array)
    mask.pixels[i + 3] = 255 - mask.pixels[i + 3]; // Invert alpha channel value
  }

  mask.updatePixels(); // Update the mask with inverted pixel values
}
