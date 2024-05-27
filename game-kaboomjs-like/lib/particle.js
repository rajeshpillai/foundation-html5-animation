class Particle {
  constructor(x, y, vx, vy, life, color) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.life = life;
      this.color = color;
  }

  update(deltaTime) {
      this.x += this.vx * deltaTime;
      this.y += this.vy * deltaTime;
      this.life -= deltaTime;
  }

  draw(ctx) {
      if (this.life > 0) {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, 2, 2);
      }
  }
}

class ParticleSystem {
  constructor() {
      this.particles = [];
  }

  addParticle(particle) {
      this.particles.push(particle);
  }

  update(deltaTime) {
      this.particles.forEach(particle => particle.update(deltaTime));
      this.particles = this.particles.filter(particle => particle.life > 0);
  }

  draw(ctx) {
      this.particles.forEach(particle => particle.draw(ctx));
  }
}
