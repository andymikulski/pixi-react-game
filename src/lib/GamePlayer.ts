import * as PIXI from 'pixi.js';
import { lerp } from './Utils';
import { IFrameHandler } from './IFrameHandler';
import Game from '../game';
import { ICollidable } from './ICollidable';
import PubSubSystem from '../PubSub';

export default class GamePlayer extends PIXI.Sprite implements IFrameHandler, ICollidable {
  public name:string = 'player:ship';
  public score:number = 0;

  private eventSystem:PubSubSystem;

  public horizontalSpeed:number = 6;
  public verticalSpeed:number = 10;

  public shootPerSec:number = 2;

  private targetPos:PIXI.IPoint = new PIXI.Point(0, 0);

  public setPosition(x:number, y:number) {
    this.targetPos.set(x, y);
  }

  public static Create(events:PubSubSystem):GamePlayer {
    const tex = PIXI.Texture.from(require('../player.png').default);
    const player = new GamePlayer(tex);
    player.eventSystem = events;
    player.width = 32;
    player.height = 32;
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

    player.position.x;
    return player;
  }



  rotateToPoint(mx: number, my: number, px: number, py: number) {
    var dist_Y = my - py;
    var dist_X = mx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle;
  }


  public update(dt:number):void {
    this.position.x = lerp(this.position.x, this.targetPos.x, (dt / 100) * this.horizontalSpeed);
    this.rotation = (-Math.PI / 2) + (((this.targetPos.x - this.position.x) / 500) * dt);
    this.position.y = lerp(this.position.y, this.targetPos.y, (dt / 100) * this.verticalSpeed);
    this.ensureInBounds();

  }

  private ensureInBounds() {

    if(this.rotation >= -Math.PI / 4) {
      this.rotation = -Math.PI / 4;
    } else if (this.rotation <= (-Math.PI * (3/4))){
      this.rotation = (-Math.PI * (3/4));
    }

    if (this.position.x < 0) {
      this.position.x = 0;
    }
    else if (this.position.x > Game.SCREEN_WIDTH) {
      this.position.x = Game.SCREEN_WIDTH;
    }
    if (this.position.y < Game.SCREEN_HEIGHT * 0.75) {
      this.position.y = Game.SCREEN_HEIGHT * 0.75;
    }
    else if (this.position.y > Game.SCREEN_HEIGHT) {
      this.position.y = Game.SCREEN_HEIGHT;
    }
  }

  public onCollision = () => {
    this.eventSystem.trigger('player:died');
  }
}