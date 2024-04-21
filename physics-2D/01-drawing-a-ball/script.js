const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

function drawBall(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fill();
}

drawBall(100, 100, 20);
drawBall(50, 150, 40);


