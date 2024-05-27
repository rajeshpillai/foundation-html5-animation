class AnimatedSprite {
    constructor(imageSrc, x, y, boxWidth, boxHeight, frameWidth, frameHeight, frameCount, frameSpeed) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.x = x;
        this.y = y;
        this.boxWidth = boxWidth; // Box width to fit sprite
        this.boxHeight = boxHeight; // Box height to fit sprite
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

        if (this.y + this.boxHeight > canvas.height) {
            this.y = canvas.height - this.boxHeight;
            this.vy = 0;
            this.onGround = true;
        }
    }

    draw(ctx) {
        const frameX = (this.currentFrame % this.frameCount) * this.frameWidth;
        const frameY = 0; // Single row sprite sheet

        // Calculate the scale factor to fit the sprite proportionately within the box
        const scaleWidth = this.boxWidth / this.frameWidth;
        const scaleHeight = this.boxHeight / this.frameHeight;
        const scale = Math.min(scaleWidth, scaleHeight);

        // Calculate the new width and height based on the scale
        this.newWidth = this.frameWidth * scale;
        this.newHeight = this.frameHeight * scale;

        // Center the sprite within the box
        this.drawX = this.x + (this.boxWidth - this.newWidth) / 2;
        this.drawY = this.y + (this.boxHeight - this.newHeight) / 2;

        ctx.rect(this.drawX, this.drawY, this.newWidth, this.newHeight);
        ctx.stroke();
        ctx.drawImage(
            this.image,
            frameX, frameY, this.frameWidth, this.frameHeight, // Source rectangle
            this.drawX, this.drawY, this.newWidth, this.newHeight // Destination rectangle
        );
    }

    getBounds() {
        return {
            x: this.drawX,
            y: this.drawY,
            width: this.newWidth,
            height: this.newHeight
        };
    }
}