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

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  add(v) {
    return new Vector(this.x+v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  magnitude() {
    return Math.sqrt(this.x**2 + this.y**2);  // Sum of x^2 + y^2
  }

  mult(n) {
    return new Vector(this.x*n, this.y*n);
  }

  // Returns a vector with same direction and 1 length
  unit() {
    if (this.magnitude() === 0) {
      return new Vector(0,0);
    } else {
      return new Vector(this.x/this.magnitude(), this.y/this.magnitude());
    }
  }

  // Returns a perpendicular normal vector
  normal() {
    return new Vector(-this.y, this.x).unit();
  }

  drawVec(start_x, start_y, n, color) {
    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
  // returns the length of a vector projection onto the other one
  static dot(v1, v2){
    return v1.x*v2.x + v1.y*v2.y;
  }
}

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vel = new Vector(0,0);
    this.acc = new Vector(0,0);
    this.acceleration = 1; 
    this.player = false;
    BALLZ.push(this);
  }

  drawBall(x, y, r) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
  }

  display() {
    // this.vel.drawVec(this.x, this.y, 10, "blue");
    // this.acc.drawVec(this.x, this.y, 100, "green");
    this.vel.drawVec(550, 300, 10, "green");
    this.acc.unit().drawVec(550, 300, 50, "blue");
    ctx.beginPath();
    ctx.arc(550, 300, 50, 0, 2*Math.PI);
    ctx.strokeStyle = "black";
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
        b.acc.x = -b.acceleration;
    }

    if (keys.right) {
        b.acc.x = b.acceleration;
    }

    if (keys.up) {
        b.acc.y= -b.acceleration;
    }

    if (keys.down) {
        b.acc.y = b.acceleration;
    }

    if (!keys.up && !keys.down) {
      b.acc.y = 0;
    }
    if (!keys.right && !keys.left) {
      b.acc.x = 0;
    }

    b.vel = b.vel.add(b.acc);
  
    // Add friction to slow things down
    b.vel = b.vel.mult(1- friction);
    
    b.x += b.vel.x;
    b.y += b.vel.y;
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


