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

class Hurdle {
    constructor(x, y, width, height) {
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
        this.player = new AnimatedSprite(
            '../assets/warrior/Run.png',
            50, canvas.height - 80,
            160, 160,
            160, 160,
            8,
            100
        );
        this.hurdles = [
            new Hurdle(600, canvas.height - 80, 40, 40),
            new Hurdle(900, canvas.height - 80, 40, 40)
        ];
    },
    update(deltaTime) {
        console.log("in gameScene....");
        if (gamePaused) return;
        this.player.update(deltaTime);
        for (const hurdle of this.hurdles) {
            hurdle.update(deltaTime);
            if (this.checkCollision(this.player.getBounds(), hurdle.getBounds())) {
                sceneManager.switchTo('gameOver');
            }
        }
    },
    render(ctx) {
        console.log("rendering player....");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const hurdle of this.hurdles) {
            hurdle.draw(ctx);
        }
        this.player.draw(ctx);
        
    },
    checkCollision(player, hurdle) {
        return player.x < hurdle.x + hurdle.width &&
               player.x + player.width > hurdle.x &&
               player.y < hurdle.y + hurdle.height &&
               player.y + player.height > hurdle.y;
    }
};

const gameOverScene = {
    init() {},
    update(deltaTime) {
        console.log("GAME OVER>>>");
        if (keys['Enter']) {
            sceneManager.switchTo('game');
        }
    },
    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Press Enter to Restart', 150, 200);
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