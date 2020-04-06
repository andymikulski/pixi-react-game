import * as PIXI from 'pixi.js';
import { lerp } from './Utils';
import { IFrameHandler } from './IFrameHandler';
import Game from '../game';
import { ICollidable } from './ICollidable';
import PubSubSystem from '../PubSub';
import AssetManager from './AssetManager';
import GamePlayer from './GamePlayer';

export default class GameEnemy extends PIXI.Sprite implements IFrameHandler, ICollidable {
  public name:string = 'enemy:ship';

  private eventSystem:PubSubSystem;

  public horizontalSpeed:number = 1;
  public verticalSpeed:number = 1;

  private player:GamePlayer;


  private targetPos:PIXI.IPoint = new PIXI.Point(0, 0);

  public setPosition(x:number, y:number) {
    this.targetPos.set(x, y);
  }

  public static Create(events:PubSubSystem, player:GamePlayer):GameEnemy {
    const tex = AssetManager.Instance().getTexture('enemy:ship');
    const enemy = new GameEnemy(tex);
    enemy.eventSystem = events;
    enemy.width = 32;
    enemy.height = 32;
    enemy.anchor.x = 0.5;
    enemy.anchor.y = 0.5;
    enemy.player = player;

    return enemy;
  }


  rotateToPoint(mx: number, my: number, px: number, py: number) {
    var dist_Y = my - py;
    var dist_X = mx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle;
  }

  private lastShot = -Infinity;
  private lastMove = -Infinity;
  private now:number;

  public update(dt:number):void {
    if (this.alpha === 0){ return; }
    this.now = Date.now();

    if(this.now - this.lastShot > 5000){
      this.lastShot = this.now;
      this.eventSystem.trigger('enemy:fire', this);
      // this.setPosition(Game.SCREEN_WIDTH * Math.random(), Game.SCREEN_HEIGHT * Math.random());
    }
    if(this.now - this.lastMove > 2500){
      this.lastMove = this.now;
      this.setPosition(Game.SCREEN_WIDTH * Math.random(), Game.SCREEN_HEIGHT * Math.random());
    }


    this.rotation = lerp(this.rotation, this.rotateToPoint(this.player.position.x, this.player.position.y, this.position.x, this.position.y), dt);


    this.position.x = lerp(this.position.x, this.targetPos.x, (dt / 200) * this.horizontalSpeed);
    // this.rotation = (Math.PI / 2) - (((this.targetPos.x - this.position.x) / 500) * dt);
    this.position.y = lerp(this.position.y, this.targetPos.y, (dt / 200) * this.verticalSpeed);
  }
  public onCollision = () => {
    this.alpha = 0;
    this.eventSystem.trigger('enemy:died', this);
    this.position.set(-100, -100);
    this.setPosition(-100, -100);
  }
}