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

        this.image.onload = () => {
            console.log('Image loaded');
            //sceneManager.switchTo('loading');
        };
    }

    update(deltaTime) {
        console.log("Player updating...", this.x);
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
        console.log("Player drawing...", this.x);
        const frameX = (this.currentFrame % this.frameCount) * this.frameWidth;
        const frameY = 0; // Single row sprite sheet
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.drawImage(
            this.image,
            frameX, frameY, this.frameWidth, this.frameHeight, // Source rectangle
            this.x, this.y, this.width, this.height // Destination rectangle
        );
    }
}