const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");


const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
}


const BALLZ = [];

// velocity gets multipled by friction
let friction  = 0.1;

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vel_x = 0;
    this.vel_y = 0;
    this.acc_x = 0;
    this.acc_y = 0
    this.acceleration = 1; 
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

  display() {
    ctx.beginPath();
    // Acceleration line
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.acc_x*100, this.y + this.acc_y*100);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.closePath();

    // Velocity line
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.vel_x*10, this.y + this.vel_y*10);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.closePath();
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
        b.acc_x = -b.acceleration;
    }

    if (keys.right) {
        b.acc_x = b.acceleration;
    }

    if (keys.up) {
        b.acc_y = -b.acceleration;
    }

    if (keys.down) {
        b.acc_y = b.acceleration;
    }

    if (!keys.up && !keys.down) {
      b.acc_y = 0;
    }
    if (!keys.right && !keys.left) {
      b.acc_x = 0;
    }
    b.vel_x += b.acc_x;
    b.vel_y += b.acc_y;

    // Add friction to slow things down
    b.vel_x *= 1 - friction;
    b.vel_y *= 1 - friction;

    b.x += b.vel_x;
    b.y += b.vel_y;
}
function mainLoop() {
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
    BALLZ.forEach(b => {
      b.drawBall();
      if (b.player) {
        keyControl(b);
      }
      b.display();
    })
    requestAnimationFrame(mainLoop);
}

let ball1 = new Ball(200, 200, 30);
let ball2 = new Ball(300, 300, 20);

ball1.player = true;

requestAnimationFrame(mainLoop);


