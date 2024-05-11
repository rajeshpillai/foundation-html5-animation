var CAMERA_CANVAS = null;
var EFFECTS_CANVAS = null;
const SIZE = 300;
const INTERVAL = 42;
var THRESHOLD = 50;

var COLOR = [4, 104, 39];
var PATH = [];
const PATH_LIFETIME = 2000;

var PARTICLES = [];
var CHAOS = 10;
const G = [0, 1];

var SCORE = 0;
const SCORE_THRESHOLD = 0.96;
var GAME_OVER = false;

document.addEventListener("DOMContentLoaded", (e) => {
  main();
})

function main() {
  CAMERA_CANVAS = document.getElementById('camera');
  CAMERA_CANVAS.width = SIZE;
  CAMERA_CANVAS.height = SIZE;
  EFFECTS_CANVAS = document.getElementById('effects');
  EFFECTS_CANVAS.width = SIZE;
  EFFECTS_CANVAS.height = SIZE;

  var constraints = { video: true };
  var permission = navigator.mediaDevices.getUserMedia(constraints);
  permission.then(
    function (stream) {
      var video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      setInterval(updateImage, INTERVAL, video);
    }
  ).catch(
    function (err) {
      alert("camera error");
    }
  );

  CAMERA_CANVAS.addEventListener('mousedown', updateColor);
}

function updateImage(video) {
  const context = CAMERA_CANVAS.getContext('2d');

  const minSize = Math.min(video.videoWidth,
    video.videoHeight);
  const startX = (video.videoWidth - minSize) / 2;
  const startY = (video.videoHeight - minSize) / 2;

  context.drawImage(video, startX, startY, minSize, minSize,
    0, 0, SIZE, SIZE);

  clearEffectsCanvas();
  if (GAME_OVER == false) {
    const pixelLocations = getPointerPixels();
    // showLocations(pixelLocations);			
    if (pixelLocations.length > 0) {
      const centrePoint = average(pixelLocations);
      centrePoint.time = new Date().getTime();
      PATH.push(centrePoint);
    }
    keepRecentPartOfPath();
    SCORE = calculateRoundness();
    if (SCORE >= SCORE_THRESHOLD) {
      GAME_OVER = true;
    }
  } else {
    fillPortal("black");
    showScore(SCORE, average(PATH));
  }
  // drawPath();
  updateParticles(EFFECTS_CANVAS);
}

function getPointerPixels() {
  const context = CAMERA_CANVAS.getContext("2d");
  const imageData = context.getImageData(0, 0, SIZE, SIZE);
  const oneDArray = imageData.data;

  var pixelLocations = [];
  for (var y = 0; y < SIZE; y++) {
    for (var x = 0; x < SIZE; x++) {
      const r = oneDArray[y * SIZE * 4 + x * 4 + 0];
      const g = oneDArray[y * SIZE * 4 + x * 4 + 1];
      const b = oneDArray[y * SIZE * 4 + x * 4 + 2];
      if (distance(COLOR, [r, g, b]) < THRESHOLD) {
        pixelLocations.push([x, y]);
      }
    }
  }
  return pixelLocations;
}

function showLocations(locations) {
  const context = EFFECTS_CANVAS.getContext("2d");
  for (var i = 0; i < locations.length; i++) {
    context.fillStyle = "black";
    context.fillRect(...locations[i], 1, 1);
  }
  context.fill();
}

function clearEffectsCanvas() {
  const context = EFFECTS_CANVAS.getContext("2d");
  context.clearRect(0, 0, SIZE, SIZE);
}

function updateColor(event) {
  const location = getCursorPosition(event);
  const context = CAMERA_CANVAS.getContext('2d');
  const imageData = context.getImageData(...location, 1, 1);
  const oneDArray = imageData.data;
  COLOR[0] = oneDArray[0]; COLOR[1] = oneDArray[1]; COLOR[2] = oneDArray[2];
}

function getCursorPosition(event) {
  const rect = CAMERA_CANVAS.getBoundingClientRect();
  const x = (event.clientX - rect.left);
  const y = (event.clientY - rect.top);
  return [x, y];
}

function average(locations) {
  var loc = [0, 0];
  for (var i = 0; i < locations.length; i++) {
    loc[0] += locations[i][0];
    loc[1] += locations[i][1];
  }
  loc[0] /= locations.length;
  loc[1] /= locations.length;
  return loc;
}

function keepRecentPartOfPath() {
  const now = new Date().getTime();
  while (PATH.length > 0 && now - PATH[0].time > PATH_LIFETIME) {
    PATH.shift();
  }
}

function drawPath() {
  for (var i = 0; i < PATH.length - 1; i++) {
    drawSegment(PATH[i], PATH[i + 1]);
  }
}

function drawSegment(from, to, color = "black") {
  const context = EFFECTS_CANVAS.getContext("2d");
  context.beginPath();
  context.moveTo(...from);
  context.lineTo(...to);
  context.lineWidth = 2;
  context.strokeStyle = color;
  context.stroke();
}

function calculateRoundness() {
  const length = getPolygonLength();
  const area = getPolygonArea();
  const R = length / (Math.PI * 2);
  const circleArea = Math.PI * R * R;
  const roundness = area / circleArea;
  return roundness;
}

function getPolygonLength() {
  var length = 0;
  for (var i = 0; i < PATH.length; i++) {
    var nextI = i + 1;
    if (nextI == PATH.length) {
      nextI = 0;
    }
    length += distance(PATH[i], PATH[nextI]);
  }
  return length;
}

function getPolygonArea() {
  var area = 0;
  for (var i = 0; i < PATH.length; i++) {
    var nextI = i + 1;
    if (nextI == PATH.length) {
      nextI = 0;
    }
    area += PATH[i][0] * PATH[nextI][1];
    area -= PATH[i][1] * PATH[nextI][0];
  }
  area = Math.abs(area) / 2
  return area;
}

class Particle {
  constructor(location, velocity) {
    this.location = location;
    this.velocity = velocity;
    this.life = 10;
    this.green = 100 + Math.round(Math.random() * 100);
  }

  move() {
    this.velocity = addVectors(this.velocity, G)
    this.location = addVectors(this.location, this.velocity);
    this.life--;
  }

  draw() {
    const opacity = this.life / 10;
    const color = "rgba(255," + this.green + ",0," + opacity + ")";
    const oldLocation = subtractVectors(this.location, this.velocity);
    drawSegment(this.location, oldLocation, color);
  }
}

function updateParticles() {
  for (var i = 0; i < PATH.length; i++) {
    var velocity = [
      CHAOS * (Math.random() - 0.5),
      CHAOS * (Math.random() - 0.5)
    ];
    if (i > 0) {
      const movement = subtractVectors(PATH[i - 1], PATH[i]);
      velocity = addVectors(velocity, movement);
    }
    PARTICLES.push(new Particle(PATH[i], velocity));
  }
  for (var i = 0; i < PARTICLES.length; i++) {
    PARTICLES[i].move();
    PARTICLES[i].draw();
  }
  while (PARTICLES.length > 0 && PARTICLES[0].life == 0) {
    PARTICLES.shift();
  }
}

function distance(p1, p2) {
  var dist = 0;
  for (var i = 0; i < p1.length; i++) {
    dist += (p1[i] - p2[i]) * (p1[i] - p2[i]);
  }
  return Math.sqrt(dist);
}

function addVectors(v1, v2) {
  var newV = [
    v1[0] + v2[0],
    v1[1] + v2[1]
  ];
  return newV;
}

function subtractVectors(v1, v2) {
  var newV = [
    v1[0] - v2[0],
    v1[1] - v2[1]
  ];
  return newV;
}

function showScore(score, location) {
  const context = EFFECTS_CANVAS.getContext("2d");
  context.font = "bold 40px Arial";
  context.fillStyle = "orange";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const formattedScore = (score * 100).toFixed(1) + " %";
  context.fillText(formattedScore, ...location);
}

function fillPortal(color) {
  var context = EFFECTS_CANVAS.getContext("2d");
  context.beginPath();
  context.moveTo(...PATH[0]);
  for (var i = 1; i < PATH.length; i++) {
    context.lineTo(...PATH[i]);
  }
  context.fillStyle = color;
  context.fill();
}