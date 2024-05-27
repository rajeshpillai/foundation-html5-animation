class UIButton {
  constructor(x, y, width, height, text, onClick) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.text = text;
      this.onClick = onClick;
  }

  draw(ctx) {
      ctx.fillStyle = 'gray';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = 'white';
      ctx.fillText(this.text, this.x + 10, this.y + 20);
  }

  handleClick(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
          this.onClick();
      }
  }
}

// const startButton = new UIButton(350, 250, 100, 50, 'Start', () => {
//   sceneManager.switchTo('game');
// });

// canvas.addEventListener('click', (event) => {
//   startButton.handleClick(event);
// });
