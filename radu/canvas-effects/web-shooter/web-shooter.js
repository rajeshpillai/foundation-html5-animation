var COLOR =[0,90,190];

class WebShooterEffect{
  constructor(canvas,video){
      this.canvas=canvas;
      this.video=video;  

      this.shooting=false;
      this.particles=[];

      this.idleCount=5;

      this.ctx=canvas.getContext("2d");
      this.audioEffect=new AudioEffect();
      this.animate();
  }

  // Invokded from clicking on the canvas
  updateColor(event) {
    const location = this.#getCursorPosition(event);
    const context = this.canvas.getContext('2d');
    const imageData = this.ctx.getImageData(...location, 1, 1);
    const oneDArray = imageData.data;
    COLOR[0] = oneDArray[0]; COLOR[1] = oneDArray[1]; COLOR[2] = oneDArray[2];
    console.log(COLOR);
  }
  
  #getCursorPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);
    return [x, y];
  }

  animate(){
      this.ctx.drawImage(this.video,0,0,
          this.canvas.width,this.canvas.height);
  
      const locs=getMarkedLocations(this.ctx);
      
      if(locs.length>0 && this.idleCount<=0){
          
          if(DEBUG){
              for(let i=0;i<locs.length;i++){
                  this.ctx.beginPath();
                  this.ctx.fillStyle='white';
                  this.ctx.rect(locs[i][0],locs[i][1],1,1);
                  this.ctx.fill();
              }
          }

          const C=average(locs);

          if(DEBUG){
              this.ctx.beginPath();
              this.ctx.fillStyle="green";
              this.ctx.arc(...C,10,0,Math.PI*2);
              this.ctx.fill();
          }
          
          const A=getFarthestFrom(locs,C);

          if(DEBUG){
              this.ctx.fillStyle="lightgreen";
              this.ctx.beginPath();
              this.ctx.arc(...A,10,0,Math.PI*2);
              this.ctx.fill();
          }

          if(this.shooting==false){
              this.shooting=true;
              this.audioEffect.start();
          }

          this.shoot(A,C);
      }else if(locs.length>0){
          this.idleCount--;
      }else{ 
          if(this.shooting==true){
              this.shooting=false;
              this.idleCount=5;
              for(let i=0;i<this.idleCount;i++){
                  this.particles.pop();
              }
          }
      }
  
      if(this.particles.length==0){
          this.audioEffect.stop();
      }
      this.updateParticles();
      
      if(DEBUG){
          this.showParticles();
      }
      this.showWeb();
  
      requestAnimationFrame(this.animate.bind(this));
  }

  shoot(from,to){
      const dir=Math.atan2(to[1]-from[1],to[0]-from[0]);
      const rate=distance(from,to)/2;
      this.particles.push(new Particle(from,dir,rate));
  }
  
  showParticles(){
      for(let i=0;i<this.particles.length;i++){
          this.particles[i].draw(this.ctx)
      }
  }
  
  showWeb(){
      for(let i=0;i<this.particles.length-1;i++){
          for(let j=0;j<this.particles.length;j++){
              this.ctx.beginPath();
              this.ctx.strokeStyle="white";
              this.ctx.moveTo(...this.particles[i].loc);
              this.ctx.lineTo(...this.particles[j].loc);
              this.ctx.stroke()
          }
      }
  }

  updateParticles(){
      for(let i=0;i<this.particles.length;i++){
          if(this.particles[i].loc[0]<0 || 
              this.particles[i].loc[1]<0 || 
              this.particles[i].loc[0]>this.ctx.canvas.width ||
              this.particles[i].loc[1]>this.ctx.canvas.height){
              this.particles.splice(i,1);
              i--;
          }else{
              this.particles[i].update()
          }
      }
  }
}

class Particle{
  constructor(loc,dir,speed){
      this.loc=loc;
      this.dir=dir;
      this.speed=speed;
  }
  update(){
      this.loc[0]+=this.speed*Math.cos(this.dir)
      this.loc[1]+=this.speed*Math.sin(this.dir)
  }
  draw(ctx){
      ctx.beginPath();
      ctx.fillStyle="black";
      ctx.arc(...this.loc,10,0,Math.PI*2);
      ctx.fill();
  }
}

class AudioEffect{
  constructor(){
      this.audioContext = new (window.webkitAudioContext || window.AudioContext)();
          
      const noiseBuffer = this.audioContext.createBuffer(1, 
              this.audioContext.sampleRate, 
              this.audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
          
      for (var i = 0; i < this.audioContext.sampleRate; i++) {
          output[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      noise.start(0);

      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      noise.connect(this.gainNode);

      this.gainNode.connect(this.audioContext.destination)
  }
  start(){
      this.gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime+0.1);
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime+0.5);
  }
  stop(){
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime+0.1);
  }
}

