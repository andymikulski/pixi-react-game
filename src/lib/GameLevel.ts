import * as PIXI from "pixi.js";
// PIXI.Loader.shared.add("images/spritesheet.json").load(setup);

// function setup() {
//   let sheet = PIXI.Loader.shared.resources["images/spritesheet.json"].spritesheet;
//   sheet.textures
// }
export default abstract class GameLevel {
  protected assets: string[];

  private textures: PIXI.Texture[] = [];

  protected sprites: PIXI.Sprite[] = [];

  public loadAssets() {
    for (let i = 0; i < this.assets.length; i++) {
      this.textures[i] = PIXI.Texture.from(this.assets[i]);
    }
  }

  public createSprites() {
    let sprite:PIXI.Sprite;
    for (let i = 0; i < this.textures.length; i++) {
      sprite = new PIXI.Sprite(this.textures[i]);
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      this.sprites.push(sprite);
    }
  }
}


export class LevelOne extends GameLevel {
  protected assets = [
    require('../bunny.png').default,
    require('../carrot.png').default,
  ]
}