const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});


class Physics {
  constructor(gravity) {
      this.gravity = gravity;
  }

  applyGravity(sprite) {
      sprite.y += this.gravity;
  }
}


class AnimatedSprite {
    constructor(imageSrc, x, y, width, height, frameWidth, frameHeight, frameCount, frameSpeed) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.frameSpeed = frameSpeed;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.5;
        this.jumpStrength = -10;
        this.onGround = false;
    }

    update(deltaTime) {
        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameSpeed) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
        if (keys['ArrowRight']) {
            this.vx = 2;
        } else if (keys['ArrowLeft']) {
            this.vx = -2;
        } else {
            this.vx = 0;
        }

        if (keys[' '] && this.onGround) {
            this.vy = this.jumpStrength;
            this.onGround = false;
        }

        this.vy += this.gravity;

        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.vy = 0;
            this.onGround = true;
        }
    }

    draw(ctx) {
        const frameX = (this.currentFrame * this.frameWidth) % this.image.width;
        const frameY = Math.floor((this.currentFrame * this.frameWidth) / this.image.width) * this.frameHeight;
        ctx.drawImage(
            this.image,
            frameX, frameY, this.frameWidth, this.frameHeight,
            this.x, this.y, this.width, this.height
        );
    }
}

// GAme

const physics = new Physics(0.5);

//imageSrc, x, y, width, height, frameWidth, frameHeight, frameCount, frameSpeed
const sprite = new AnimatedSprite(
    'assets/warrior/Run.png',
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
