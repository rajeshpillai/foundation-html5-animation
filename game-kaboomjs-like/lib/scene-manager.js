class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
    this.currentSceneName = null;
  }

  addScene(name, scene) {
    this.scenes[name] = scene;
  }

  switchTo(name) {
    this.currentScene = this.scenes[name];
    this.currentSceneName = name;
    if (this.currentScene?.init) {
        this.currentScene.init();
    }
  }

  update(deltaTime) {
    if (this.currentScene && this.currentScene.update) {
        console.log("Updating scene...");
        this.currentScene.update(deltaTime);
    }
  }

  render(ctx) {
    console.log("currentScene: ", this.currentScene);
    if (this.currentScene && this.currentScene.render) {
        console.log("Drawing scene...", this.currentSceneName);
        this.currentScene.render(ctx);
    }
  }
}

