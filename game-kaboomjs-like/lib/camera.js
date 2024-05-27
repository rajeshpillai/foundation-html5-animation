class Camera {
  constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  }

  follow(entity) {
      this.x = entity.x + entity.width / 2 - this.width / 2;
      this.y = entity.y + entity.height / 2 - this.height / 2;
  }

  apply(ctx) {
      ctx.translate(-this.x, -this.y);
  }
}

//const camera = new Camera(0, 0, canvas.width, canvas.height);
