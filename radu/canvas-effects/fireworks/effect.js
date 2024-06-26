class Effect{
  constructor(canvas,video){
     this.canvas=canvas;
     this.video=video; 
     this.ctx=canvas.getContext("2d");

     this.particles=[];

     this.#animate();
  }

  #animate(){
     const {ctx,canvas,video}=this;
     ctx.drawImage(video,0,0,
        canvas.width,canvas.height);
     const imgData=ctx.getImageData(
        0,0,canvas.width,canvas.height
     );
     
     const locs=getLocationsWithColor(
        imgData,{r:0,g:0,b:255}
     );
     if(locs.length>0){
        const center=average(locs);
        for(let i=1;i<=10;i++){
           this.particles.push(new Particle(center));
        }
     }
     this.particles.forEach(p=>{
        p.update(ctx);
     });
     while(this.particles.length>0 && this.particles[0].life<=0){
        this.particles.shift();
     }
     
     requestAnimationFrame(this.#animate.bind(this));
  }
}