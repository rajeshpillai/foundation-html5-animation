class Layer {
  constructor(name) {
      this.name = name;
      this.entities = [];
  }

  addEntity(entity) {
      this.entities.push(entity);
  }

  update(deltaTime) {
      this.entities.forEach(entity => entity.update(deltaTime));
  }

  render(ctx) {
      this.entities.forEach(entity => entity.draw(ctx));
  }
}

