import * as PIXI from 'pixi.js';
import { lerp } from './Utils';
import { IFrameHandler } from './IFrameHandler';
import Game from '../game';
import { ICollidable } from './ICollidable';
import PubSubSystem from '../PubSub';
import AssetManager from './AssetManager';

export default class GameEnemy extends PIXI.Sprite implements IFrameHandler, ICollidable {
  public name:string = 'enemy:ship';

  private eventSystem:PubSubSystem;

  public horizontalSpeed:number = 2;
  public verticalSpeed:number = 2;


  private targetPos:PIXI.IPoint = new PIXI.Point(0, 0);

  public setPosition(x:number, y:number) {
    this.targetPos.set(x, y);
  }

  public static Create(events:PubSubSystem):GameEnemy {
    const tex = AssetManager.Instance().getTexture('enemy:ship');
    const player = new GameEnemy(tex);
    player.eventSystem = events;
    player.width = 32;
    player.height = 32;
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

    return player;
  }



  rotateToPoint(mx: number, my: number, px: number, py: number) {
    var dist_Y = my - py;
    var dist_X = mx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle;
  }

  private lastShot = -Infinity;
  private now:number;

  public update(dt:number):void {
    this.now = Date.now();

    if(this.now - this.lastShot > 1000){
      this.lastShot = this.now;
      this.eventSystem.trigger('enemy:fire', this);

      this.setPosition(Game.SCREEN_WIDTH * Math.random(), Game.SCREEN_HEIGHT * Math.random());
    }


    // this.rotation = this.rotateToPoint()

    this.position.x = lerp(this.position.x, this.targetPos.x, (dt / 100) * this.horizontalSpeed);
    this.rotation = (Math.PI / 2) + (((this.targetPos.x - this.position.x) / 500) * dt);
    this.position.y = lerp(this.position.y, this.targetPos.y, (dt / 100) * this.verticalSpeed);
  }


  public onCollision = () => {
    this.eventSystem.trigger('enemy:died', this);
    this.position.set(-100, -100);
    this.setPosition(-100, -100);
  }
}