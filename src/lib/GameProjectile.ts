import * as PIXI from 'pixi.js';
import { lerp } from './Utils';
import { IFrameHandler } from './IFrameHandler';
import Game from '../game';
import { ICollidable } from './ICollidable';
import GamePlayer from './GamePlayer';

export interface ProjectileBehavior {
  update(proj:GameProjectile, dt:number):void;
}

export class BasicBullet implements ProjectileBehavior {
  public update(proj:GameProjectile, dt:number){
    proj.position.x += Math.cos(proj.rotation) * proj.speed * dt;
    proj.position.y += Math.sin(proj.rotation) * proj.speed * dt;

    // this.position.x = lerp(this.position.x, this.targetPos.x, (dt / 100) * this.horizontalSpeed);
    // this.rotation = (-Math.PI / 2) + (((this.targetPos.x - this.position.x) / 500) * dt);
    // this.position.y = lerp(this.position.y, this.targetPos.y, (dt / 100) * this.verticalSpeed);
  }
}

export class HomingBullet implements ProjectileBehavior {
  private basic:BasicBullet = new BasicBullet();

  constructor(private player:GamePlayer){}


  rotateToPoint(mx: number, my: number, px: number, py: number) {
    var dist_Y = my - py;
    var dist_X = mx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle;
  }

  public update(proj:GameProjectile, dt:number){
    // Point towards the player
    proj.rotation = lerp(proj.rotation, this.rotateToPoint(this.player.position.x, this.player.position.y, proj.position.x, proj.position.y), dt);

    // Propel forward
    this.basic.update(proj, dt);
  }
}

export default class GameProjectile extends PIXI.Sprite implements ICollidable {

  public name:string;
  public speed: number = 10;

  private behavior:ProjectileBehavior;


  public static Create(behavior:ProjectileBehavior, tex: PIXI.Texture): GameProjectile {
    // const tex = PIXI.Texture.from(require('../carrot.png').default);
    const proj = new GameProjectile(tex);

    proj.anchor.x = 0.5;
    proj.anchor.y = 0.5;

    proj.behavior = behavior;
    return proj;
  }





  public update(dt: number): void {
    this.behavior.update(this, dt);

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

  public onCollision = () => {
    // this.destroy();
    this.alpha = 0;
  }
}