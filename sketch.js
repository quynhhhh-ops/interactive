let coneX, coneY;
let coneWidth = 80;
let coneHeight = 40;

let score = 0;
let circles = [];

function setup() {
  createCanvas(400, 500);
  coneX = width / 2;
  coneY = height - 30;

  for (let i = 0; i < 5; i++) {
    circles.push(createCircle());
  }
}

function draw() {
  background(220);

  // Draw and move scoops
  for (let i = 0; i < circles.length; i++) {
    updateCircle(circles[i]);
    drawCircle(circles[i]);
  }

  // Draw cone
  drawCone(coneX, coneY, coneWidth, coneHeight);

  // Update cone with mouse
  coneX = mouseX;

  // Score
  fill(50);
  textSize(18);
  text("Score: " + score, 10, 30);
}

// Create a scoop
function createCircle() {
  return {
    x: random(width),
    y: random(height / 2),
    r: 30,
    speedX: random([-2, 2]),
    speedY: random(2, 4),
    bounces: 0
  };
}

// Update scoop behavior
function updateCircle(c) {
  c.x += c.speedX;
  c.y += c.speedY;

  // Bounce off walls
  if (c.x - c.r < 0 || c.x + c.r > width) {
    c.speedX *= -1;
    c.x = constrain(c.x, c.r, width - c.r);
  }

  if (c.y - c.r < 0 || c.y + c.r > height) {
    c.speedY *= -1;
    c.y = constrain(c.y, c.r, height - c.r);
    c.r *= 0.9;
    c.bounces++;
  }

  // Check if caught by cone
  let coneTop = coneY - coneHeight;
  let coneBottom = coneY;
  let coneLeft = coneX - coneWidth / 2;
  let coneRight = coneX + coneWidth / 2;

  if (
    c.y + c.r > coneTop &&
    c.y + c.r < coneBottom &&
    c.x > coneLeft &&
    c.x < coneRight
  ) {
    let points = max(1, 5 - c.bounces);
    score += points;
    Object.assign(c, createCircle());
  }

  // Reset if too small
  if (c.r < 8) {
    Object.assign(c, createCircle());
  }
}

// Draw the scoop with a scalloped bottom
function drawCircle(c) {
  noStroke();
  fill(190, 210, 180); // pastel sage green

  let r = c.r;
  let x = c.x;
  let y = c.y;

  // Top dome
  arc(x + 7, y + 24, r * 2, r * 2.22, PI, 0, CHORD);

  // Scalloped bumps
  let bumps = 5;
  let bumpR = r * 0.4;
  let spacing = (r * 2.3) / (bumps + 0.5);
  let bumpY = y + r - bumpR * 0.5;

  for (let i = 0; i < bumps; i++) {
    let cx = x - r + spacing * (i + 1);
    arc(cx, bumpY, bumpR, bumpR, 0, PI, CHORD);
  }
}

// Draw pastel waffle cone
function drawCone(x, baseY, w, h) {
  fill(210, 180, 140); // pastel brown
  noStroke();

  beginShape();
vertex(x - w / 2, baseY - h);
quadraticVertex(x - w / 2, baseY - h + h * 0.3, x, baseY);
quadraticVertex(x + w / 2, baseY - h + h * 0.3, x + w / 2, baseY - h);
endShape(CLOSE);


  // Waffle lines (horizontal only for clarity)
  stroke(200, 160, 110);
  strokeWeight(1);
  let linesCount = 6;
  for (let i = 1; i < linesCount; i++) {
    let yOffset = map(i, 0, linesCount, baseY, baseY - h);
    let offsetX = (baseY - yOffset) * (w / (2 * h));
    let xStart = x - offsetX;
    let xEnd = x + offsetX;
    line(xStart, yOffset, xEnd, yOffset);
  }
}