let canvas, ctx, video;

const COLOR =[8,73,175]; // Blue color
const THRESHOLD=50;

document.addEventListener("DOMContentLoaded", (e) => {
  main();
})

function main(){
    canvas=document.getElementById("myCanvas");
    ctx=canvas.getContext("2d");

    navigator.mediaDevices.getUserMedia({video:true})
        .then(function(rawData){
            video=document.createElement("video");
            video.srcObject=rawData;
            video.play();
            video.onloadeddata=animateTorchEffect;
        }).catch(function(err){alert(err)})
}

function animateTorchEffect(){
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    ctx.drawImage(video,0,0,canvas.width,canvas.height);

    const locs=[];

    const {data}=ctx.getImageData(0,0,canvas.width,canvas.height);
    // Print top left corner pixel color
    // console.log(`rgb(${data[0]}, ${data[1]}, ${data[2] })`);
    
    for(let i=0;i<data.length;i+=4){  // RGBA (so +4)
        const r=data[i];
        const g=data[i+1];
        const b=data[i+2];
        // const alpha = data[i+3];  // NOT USED in this code 

        if(distance([r,g,b],COLOR) < THRESHOLD){
            const x = (i/4)%canvas.width;
            const y = Math.floor((i/4)/canvas.width);
            locs.push({x,y});
        }
    }
    
    if(locs.length>0){
        const center={x:0,y:0};
        for(let i=0;i<locs.length;i++){
            center.x+=locs[i].x;
            center.y+=locs[i].y;
        }

        center.x/=locs.length;
        center.y/=locs.length;


        // TEST CODE
        // ctx.save();
        // ctx.fillStyle = "green";
        // ctx.arc(center.x, center.y, 50, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.restore();
        
        let rad =Math.sqrt(
            canvas.width * canvas.width + canvas.height*canvas.height);
        
        rad += Math.random()*0.1*rad;
        
        // const grd=ctx.createRadialGradient(
        //   center.x,center.y, 0,
        //   center.x,center.y, 50
        // )
      

        const grd=ctx.createRadialGradient(
            center.x,center.y,rad*0.05,
            center.x,center.y,rad*0.2
        )
        
        grd.addColorStop(0,"rgba(0,0,0,0)"); // full transparent black
        grd.addColorStop(1,"rgba(0,0,0,0.8)"); // semi transparent black

        ctx.fillStyle=grd;
        ctx.arc(center.x,center.y,rad,0,Math.PI*2);
        ctx.fill();
    }else{ // we don't have blue pixels
        ctx.fillStyle="rgba(0,0,0,0.8)";
        ctx.rect(0,0,canvas.width,canvas.height);
        ctx.fill();
    }
    requestAnimationFrame(animateTorchEffect);
}

/**
 * Calculates the Euclidean distance between two points in 3-dimensional space.
 * 
 * The Euclidean distance is the "straight-line" distance between two points in Euclidean space.
 * This function expects each point to be represented as an array of three numbers, corresponding
 * to the x, y, and z coordinates of the point.
 * 
 * @param {number[]} v1 - The first point, represented as an array [x1, y1, z1].
 * @param {number[]} v2 - The second point, represented as an array [x2, y2, z2].
 * @returns {number} The Euclidean distance between points v1 and v2.
 *
 * @example
 * // Calculates the distance between point (1, 2, 3) and point (4, 6, 8)
 * console.log(distance([1, 2, 3], [4, 6, 8])); // Outputs approximately 7.071
 */
function distance(v1,v2){
    return Math.sqrt(
        (v1[0] - v2[0]) * (v1[0] - v2[0])
      + (v1[1] - v2[1]) * (v1[1] - v2[1])
      + (v1[2] - v2[2]) * (v1[2] - v2[2])
    );
}