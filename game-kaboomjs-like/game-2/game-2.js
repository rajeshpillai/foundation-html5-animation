const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};
let gamePaused = false;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

class Hurdle extends Sprite{
    constructor(x, y, width, height) {
        super(null, x, y, width, height);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    update(deltaTime) {
        this.x -= 2; // Move hurdle to the left
        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class Player extends Sprite {
    constructor(imageSrc, x, y, boxWidth, boxHeight, frameWidth, frameHeight, frameCount, frameSpeed) {
        super(imageSrc, x, y, boxWidth, boxHeight); //, frameWidth, frameHeight, frameCount, frameSpeed);
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.5;
        this.jumpStrength = -15;
        this.onGround = false;
    }

    update(deltaTime) {
        super.update(deltaTime);

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

        // Prevent falling through the floor
        if (this.y + this.boxHeight > canvas.height) {
            this.y = canvas.height - this.boxHeight;
            this.vy = 0;
            this.onGround = true;
        }
    }
}


const sceneManager = new SceneManager();

const loadingScene = {
    init() {},
    update(deltaTime) {
        if (keys['Enter']) {
            keys['Enter'] = false;
            console.log("Switchng state to game mode...");
            sceneManager.switchTo('game');
        }
    },
    render(ctx) {
        // ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Press Enter to Start', 250, 200);
    }
};

const gameScene = {
    init() {
        this.player = new Player(
            '../assets/warrior/birdy.png',
            50, canvas.height - 80,
            60, 60,
            60, 60,
            8,
            100
        );
        this.hurdles = [
            new Hurdle(600, canvas.height - 80, 40, 40),
            new Hurdle(900, canvas.height - 80, 40, 40),
            new Hurdle(1200, canvas.height - 80, 40, 40)
        ];

        this.particleSystem = new ParticleSystem();
    },

    update(deltaTime) {
        if (gamePaused) return;
        this.player.update(deltaTime);
        for (const hurdle of this.hurdles) {
            hurdle.update(deltaTime);
            if (this.checkCollision(this.player.getBounds(), hurdle.getBounds())) {
                this.triggerParticles(hurdle.x, hurdle.y);
                sceneManager.switchTo('gameOver');
            }
        }
        // Update particles
        this.particleSystem.update(deltaTime);
    },
    render(ctx) {
        if (gamePaused) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const hurdle of this.hurdles) {
            hurdle.draw(ctx);
        }
        this.player.draw(ctx);

        // Draw particles
        this.particleSystem.draw(ctx);
        
    },

    checkCollision(player, hurdle) {
        return player.x < hurdle.x + hurdle.width &&
               player.x + player.width > hurdle.x &&
               player.y < hurdle.y + hurdle.height &&
               player.y + player.height > hurdle.y;
    },

    triggerParticles(x, y) {
        for (let i = 0; i < 20; i++) { // Number of particles
            const vx = (Math.random() - 0.5) * 0.2; // Random horizontal velocity
            const vy = (Math.random() - 0.5) * 0.2; // Random vertical velocity
            const life = 1000; // Particle life in milliseconds
            const color = 'rgba(255, 255, 255, 0.7)'; // Particle color
            this.particleSystem.addParticle(new Particle(x, y, vx, vy, life, color));
        }
    },  
};

const gameOverScene = {
    init() {},
    update(deltaTime) {
        console.log("GAME OVER>>>");
        if (keys['Enter']) {
            sceneManager.switchTo('game');
        }

        // Update particles
        gameScene.particleSystem.update(deltaTime);
    },
    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Press Enter to Restart', 150, 200);

        gameScene.particleSystem.draw(ctx);
    }
};

sceneManager.addScene('loading', loadingScene);
sceneManager.addScene('game', gameScene);
sceneManager.addScene('gameOver', gameOverScene);
sceneManager.switchTo('loading');

let lastTime = 0;

function gameLoop(timestamp) {
    //ctx.clearRect(0,0,canvas.width, canvas.height);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

     // Pause and Resume logic
     if (keys['p']) {
        gamePaused = true;
        keys['p'] = false;
    }
    if (keys['r']) {
        gamePaused = false;
        keys['r'] = false;
    }


    sceneManager.update(deltaTime);
    sceneManager.render(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);