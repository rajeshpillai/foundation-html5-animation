class Tween {
  constructor(object, property, start, end, duration, easing) {
      this.object = object;
      this.property = property;
      this.start = start;
      this.end = end;
      this.duration = duration;
      this.easing = easing;
      this.time = 0;
  }

  update(deltaTime) {
      this.time += deltaTime;
      const progress = Math.min(this.time / this.duration, 1);
      const value = this.start + (this.end - this.start) * this.easing(progress);
      this.object[this.property] = value;
  }

  isFinished() {
      return this.time >= this.duration;
  }
}

// const easeOutQuad = t => t * (2 - t);
// const spriteTween = new Tween(sprite, 'x', 50, 400, 1000, easeOutQuad);
