const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let x = 100;
let y = 100;

const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
}

function drawBall(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fill();
}

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
  

function update() {
    if (keys.left) {
        x--;
    }

    if (keys.right) {
        x++;
    }

    if (keys.up) {
        y--;
    }

    if (keys.down) {
        y++;
    }
}
function render() {
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
    update();
    drawBall(x, y, 20);
    requestAnimationFrame(render);
}

render();


