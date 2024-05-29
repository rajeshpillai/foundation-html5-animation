// class AnimatedSpriteSheet {
//     constructor(imageSrc, x, y, boxWidth, boxHeight, frameWidth, frameHeight, frameCount, frameSpeed) {
//         this.image = new Image();
//         this.image.src = imageSrc;
//         this.x = x;
//         this.y = y;
//         this.boxWidth = boxWidth; // Box width to fit sprite
//         this.boxHeight = boxHeight; // Box height to fit sprite
//         this.frameWidth = frameWidth;
//         this.frameHeight = frameHeight;
//         this.frameCount = frameCount;
//         this.frameSpeed = frameSpeed;
//         this.currentFrame = 0;
//         this.frameTimer = 0;
//         this.loaded = false;
//         this.frameBounds = [];

//         this.image.onload = () => {
//             this.loaded = true;
//             this.createSpriteSheet();
//         };
//     }

//     createSpriteSheet() {
//         const offscreenCanvas = document.createElement('canvas');
//         offscreenCanvas.width = this.frameWidth * this.frameCount;
//         offscreenCanvas.height = this.frameHeight;
//         const offscreenCtx = offscreenCanvas.getContext('2d');

//         offscreenCtx.drawImage(this.image, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
//         this.imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);

//         // Calculate the bounding box for each frame
//         for (let i = 0; i < this.frameCount; i++) {
//             this.frameBounds.push(this.getFrameBounds(offscreenCtx, i));
//         }
//     }

//     getFrameBounds(ctx, frameIndex) {
//         const frameX = frameIndex * this.frameWidth;
//         const frameY = 0;
//         const imageData = ctx.getImageData(frameX, frameY, this.frameWidth, this.frameHeight);

//         let minX = this.frameWidth, minY = this.frameHeight, maxX = 0, maxY = 0;

//         for (let y = 0; y < this.frameHeight; y++) {
//             for (let x = 0; x < this.frameWidth; x++) {
//                 const alpha = imageData.data[(y * this.frameWidth + x) * 4 + 3];
//                 if (alpha > 0) {
//                     if (x < minX) minX = x;
//                     if (y < minY) minY = y;
//                     if (x > maxX) maxX = x;
//                     if (y > maxY) maxY = y;
//                 }
//             }
//         }

//         if (minX > maxX || minY > maxY) {
//             return { minX: 0, minY: 0, width: this.frameWidth, height: this.frameHeight };
//         }

//         return { minX, minY, width: maxX - minX + 1, height: maxY - minY + 1 };
//     }

//     update(deltaTime) {
//         if (!this.loaded) return;

//         this.frameTimer += deltaTime;
//         if (this.frameTimer > this.frameSpeed) {
//             this.frameTimer = 0;
//             this.currentFrame = (this.currentFrame + 1) % this.frameCount;
//         }
//     }

//     draw(ctx) {
//         if (!this.loaded) return;

//         const frameX = this.currentFrame * this.frameWidth;
//         const bounds = this.frameBounds[this.currentFrame];

//         // Calculate the scale factor to fit the sprite proportionately within the box
//         const scaleWidth = this.boxWidth / bounds.width;
//         const scaleHeight = this.boxHeight / bounds.height;
//         const scale = Math.min(scaleWidth, scaleHeight);

//         // Calculate the new width and height based on the scale
//         const newWidth = bounds.width * scale;
//         const newHeight = bounds.height * scale;

//         // Center the sprite within the box
//         const drawX = this.x + (this.boxWidth - newWidth) / 2;
//         const drawY = this.y + (this.boxHeight - newHeight) / 2;

//         ctx.clearRect(drawX, drawY, newWidth, newHeight); // Clear the previous frame

//         ctx.rect(drawX, drawY, newWidth, newHeight );
//         ctx.stroke();

//         ctx.drawImage(
//             this.image,
//             frameX + bounds.minX, bounds.minY, bounds.width, bounds.height, // Source rectangle (sx, sy, sWidth, sHeight)
//             drawX, drawY, newWidth, newHeight // Destination rectangle (dx, dy, dWidth, dHeight)
//         );

//         // Update the bounds for collision detection
//         this.bounds = {
//             x: drawX,
//             y: drawY,
//             width: newWidth,
//             height: newHeight
//         };
//     }

//     getBounds() {
//         return this.bounds || { x: 0, y: 0, width: 0, height: 0 }; // Ensure bounds are defined
//     }
// }


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
            this.drawX = this.x; //this.x + (this.boxWidth - newWidth) / 2;
            this.drawY = this.y; //this.y + (this.boxHeight - newHeight) / 2;

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
                x: this.drawX-20,
                y: this.drawY-20,
                width: newWidth-40,
                height: newHeight-20
            };
        }
    }
    getBounds() {
        return this.bounds || { x: 0, y: 0, width: 0, height: 0 }; // Ensure bounds are defined
    }
}
