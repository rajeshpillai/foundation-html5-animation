class Sprite {
  constructor(imageSrc, x, y, boxWidth, boxHeight) {
      this.image = new Image();
      this.image.src = imageSrc;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.gravity = 0;
      this.jumpStrength = -10;
      this.onGround = true;
      this.boxWidth = boxWidth; // Box width to fit sprite
      this.boxHeight = boxHeight; // Box height to fit sprite
      
      this.image.onload = () => {
          this.loaded = true;
          this.updateScale();
      };
  }

  updateScale() {
      // Calculate the scale factor to fit the sprite proportionately within the box
      const scaleWidth = this.boxWidth / this.image.width;
      const scaleHeight = this.boxHeight / this.image.height;
      this.scale = Math.min(scaleWidth, scaleHeight);

      // Calculate the new width and height based on the scale
      this.newWidth = this.image.width * this.scale;
      this.newHeight = this.image.height * this.scale;

      // Center the sprite within the box
      this.drawX = this.x + (this.boxWidth - this.newWidth) / 2;
      this.drawY = this.y + (this.boxHeight - this.newHeight) / 2;
  }

  update(deltaTime) {
    this.updateScale();    
  }

  draw(ctx) {
      if (this.loaded) {
          console.log(`drawX = ${this.drawX}, drawY = ${this.drawY}`);
          ctx.drawImage(
              this.image,
              this.drawX, this.drawY, this.newWidth, this.newHeight
          );
      }
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
