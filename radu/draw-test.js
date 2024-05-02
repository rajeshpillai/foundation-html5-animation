document.addEventListener("mousemove", (e) => {
    M.x = e.offsetX;
    M.y = e.offsetY;
})

const A = {
    x: 100,
    y: 100, 
}

const B = {
    x: 200,
    y: 200
}

const M = {
    x: 100,
    y: 100,
}



function draw() {
    clear();
    dot(A, "A");
    dot(B, "B");
    
    segment(A, B);
    
    circle({x: 150, y: 150}, 40, "c");
    
    box({x: 250, y: 250}, 40, 50);
    box(M, 40, 50);
    window.requestAnimationFrame(draw);
}

draw();
