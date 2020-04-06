export interface ICollidable extends PIXI.Sprite {
  name:string;
  onCollision():void;
}