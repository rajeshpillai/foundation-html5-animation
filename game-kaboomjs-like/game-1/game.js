const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  keys['touch'] = { x: touch.clientX, y: touch.clientY };
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  delete keys['touch'];
});


// Game

//imageSrc, x, y, width, height, frameWidth, frameHeight, frameCount, frameSpeed
const sprite = new AnimatedSprite(
    '../assets/warrior/Run.png',
    150, 50,
    190, 111, // Display Size
    160, 111, // Frame size
    8,
    100
);

let lastTime = 0;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    sprite.update(deltaTime);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sprite.draw(ctx);
}

requestAnimationFrame(gameLoop);
