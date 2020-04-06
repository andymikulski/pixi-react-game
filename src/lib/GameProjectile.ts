import * as PIXI from 'pixi.js';
import { lerp } from './Utils';
import { IFrameHandler } from './IFrameHandler';
import Game from '../game';
import { ICollidable } from './ICollidable';

export default class GameProjectile extends PIXI.Sprite implements ICollidable {

  public name:string;
  public speed: number = 10;


  public static Create(tex: PIXI.Texture): GameProjectile {
    // const tex = PIXI.Texture.from(require('../carrot.png').default);
    const proj = new GameProjectile(tex);

    proj.anchor.x = 0.5;
    proj.anchor.y = 0.5;

    proj.position.x;
    return proj;
  }



  rotateToPoint(mx: number, my: number, px: number, py: number) {
    var dist_Y = my - py;
    var dist_X = mx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle;
  }


  public update(dt: number): void {
    this.position.x += Math.cos(this.rotation) * this.speed * dt;
    this.position.y += Math.sin(this.rotation) * this.speed * dt;

    // this.position.x = lerp(this.position.x, this.targetPos.x, (dt / 100) * this.horizontalSpeed);
    // this.rotation = (-Math.PI / 2) + (((this.targetPos.x - this.position.x) / 500) * dt);
    // this.position.y = lerp(this.position.y, this.targetPos.y, (dt / 100) * this.verticalSpeed);
    this.ensureInBounds();
  }

  private ensureInBounds() {
    if (this.position.x < 0
      || this.position.x > Game.SCREEN_WIDTH
      || this.position.y < 0
      || this.position.y > Game.SCREEN_HEIGHT) {
      // this.destroy();
    }
  }
}