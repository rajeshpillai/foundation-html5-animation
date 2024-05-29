class AnimatedSpriteSheet {
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
        this.imageData = null;

        this.image.onload = () => {
            this.loaded = true;
            this.createSpriteSheet();
        };
    }

    createSpriteSheet() {
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = this.frameWidth * this.frameCount;
        offscreenCanvas.height = this.frameHeight;
        const offscreenCtx = offscreenCanvas.getContext('2d');

        offscreenCtx.drawImage(this.image, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        this.imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    }

    update(deltaTime) {
        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameSpeed) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    draw(ctx) {
        console.log("ASP: ", this.loaded);
        if (this.loaded && this.imageData) {
            const frameX = this.currentFrame * this.frameWidth;

            // Calculate the scale factor to fit the sprite proportionately within the box
            const scaleWidth = this.boxWidth / this.frameWidth;
            const scaleHeight = this.boxHeight / this.frameHeight;
            const scale = Math.min(scaleWidth, scaleHeight);

            // Calculate the new width and height based on the scale
            const newWidth = this.frameWidth * scale;
            const newHeight = this.frameHeight * scale;

            // Center the sprite within the box
            this.drawX = this.x + (this.boxWidth - newWidth) / 2;
            this.drawY = this.y + (this.boxHeight - newHeight) / 2;

            console.log(`Drawing sprite sheet at ${this.drawX}, ${this.drawY}`);
            
            ctx.rect(this.drawX, this.drawY, newWidth, newHeight);
            ctx.stroke();

            ctx.drawImage(
                this.image,
                frameX, 0, this.frameWidth, this.frameHeight, // Source rectangle (sx, sy, sWidth, sHeight)
                this.drawX, this.drawY, newWidth, newHeight // Destination rectangle (dx, dy, dWidth, dHeight)
            );

            // Update the bounds for collision detection
            this.bounds = {
                x: this.drawX,
                y: this.drawY,
                width: newWidth,
                height: newHeight
            };
        }
    }
    getBounds() {
        return this.bounds || { x: 0, y: 0, width: 0, height: 0 }; // Ensure bounds are defined
    }
}
