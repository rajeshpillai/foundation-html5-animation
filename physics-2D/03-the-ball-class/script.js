const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");


const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
}


const BALLZ = [];

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.player = false;
    BALLZ.push(this);
  }

  drawBall(x, y, r) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
}

function keyControl(b) {
  canvas.addEventListener("keydown", function (e) {
    // Left
    if (e.keyCode == 37) {
      keys.left = true;
    }  
  
    // Up
    if (e.keyCode == 38) {
      keys.up = true;
    }  
  
  
    // Right
    if (e.keyCode == 39) {
      keys.right = true;
    }  
  
    // Down
    if (e.keyCode == 40) {
      keys.down = true;
    }  
  })
  
  canvas.addEventListener("keyup", function (e) {
      // Left
      if (e.keyCode == 37) {
        keys.left = false;
      }  
    
      // Up
      if (e.keyCode == 38) {
        keys.up = false;
      }  
    
    
      // Right
      if (e.keyCode == 39) {
        keys.right = false;
      }  
    
      // Down
      if (e.keyCode == 40) {
        keys.down = false;
      }  
    })
    
    update(b);
}


function update(b) {
    if (keys.left) {
        b.x--;
    }

    if (keys.right) {
        b.x++;
    }

    if (keys.up) {
        b.y--;
    }

    if (keys.down) {
        b.y++;
    }
}
function mainLoop() {
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
    BALLZ.forEach(b => {
      b.drawBall();
      if (b.player) {
        keyControl(b);
      }
    })
    requestAnimationFrame(mainLoop);
}

let ball1 = new Ball(200, 200, 30);
let ball2 = new Ball(300, 300, 20);

ball2.player = true;

requestAnimationFrame(mainLoop);


