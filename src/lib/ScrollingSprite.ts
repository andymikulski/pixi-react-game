import * as PIXI from 'pixi.js';
import { IFrameHandler } from './IFrameHandler';

export default class ScrollingSprite extends PIXI.TilingSprite implements IFrameHandler {

  constructor(texture: PIXI.Texture, private vSpeed:number = 0, private hSpeed:number = 0){
    super(texture);


  }

  public update(dt:number):void {
    this.tilePosition.y += (dt / 1) * this.vSpeed;
    this.tilePosition.x += (dt / 1) * this.hSpeed;
  }
}