//the coordinates of the block
let x = 0
let y = 0

//the vertical velocity of the block
let yvel = 0

document.addEventListener("DOMContentLoaded", onLoad, false);

function onLoad() {

    //input is the array of keys currently pressed down
    input = []

    //when a key is pressed down, this adds it to input
    document.addEventListener("keydown",(event) => {
        if(!input.includes(event.key)) {
            input.push(event.key)
        }
    })

    //when a key is released, this removes it from input
    document.addEventListener("keyup",(event) => {
        i = input.indexOf(event.key)
        if(i!=-1) {
            input.splice(i,1)
        }
    })
    
    requestAnimationFrame(animate);
}

function animate() {
    //this is the update function
    
    //this is the gravity logic
    if(y+yvel<0) {
        y = 0
        yvel = 0
    } else if(y>0){
        yvel -= 0.25
        y += yvel
    } else {
        yvel = 0
        y = 0
    }

    //this updates coordinates and velocity based on input
    if(input.includes("w") && y == 0) {
        yvel = 3
        y+=yvel
    }
    if(input.includes("a")) {
        x -= 1
    }
    if(input.includes("d")) {
        x += 1
    }
    
    //this updates the css for the block based on coordinates
    document.getElementById("char").style.left = "min(" + x + "vw, " + x + "vh)";
    document.getElementById("char").style.bottom = "min(" + y + "vw, " + y + "vh)";

    requestAnimationFrame(animate);
}