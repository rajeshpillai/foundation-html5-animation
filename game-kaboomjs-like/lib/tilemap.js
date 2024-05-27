class Tilemap {
  constructor(tileset, tileSize, map) {
      this.tileset = new Image();
      this.tileset.src = tileset;
      this.tileSize = tileSize;
      this.map = map;
  }

  draw(ctx) {
      for (let y = 0; y < this.map.length; y++) {
          for (let x = 0; x < this.map[y].length; x++) {
              const tile = this.map[y][x];
              ctx.drawImage(
                  this.tileset,
                  tile * this.tileSize, 0, this.tileSize, this.tileSize,
                  x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize
              );
          }
      }
  }
}

const map = [
  [0, 1, 1, 0],
  [1, 1, 1, 1],
  [0, 1, 1, 0],
  [0, 0, 0, 0]
];

//const tilemap = new Tilemap('tileset.png', 32, map);
