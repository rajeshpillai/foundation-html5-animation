class Particle {
    constructor(x, y, vx, vy, life, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life || 1000;  // Particle life in milliseconds
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

    isAlive() {
        return this.life > 0;
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
        this.particles = this.particles.filter(particle => particle.isAlive());
    }

    draw(ctx) {
        console.log("Drawing particles...");
        this.particles.forEach(particle => particle.draw(ctx));
    }
}
