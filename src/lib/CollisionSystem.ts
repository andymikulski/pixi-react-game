import * as PIXI from 'pixi.js';
import { IAfterFrameHandler } from './IAfterFrameHandler';
import { SpatialHash } from './SpatialHash';
import PubSubSystem from '../PubSub';
import { ICollidable } from './ICollidable';
import GameProjectile from './GameProjectile';

const AABB = (one: PIXI.Rectangle, two: PIXI.Rectangle) => {
  return !(two.left > one.right ||
    two.right < one.left ||
    two.top > one.bottom ||
    two.bottom < one.top);
}

export default class CollisionSystem implements IAfterFrameHandler {
  private hash: SpatialHash = new SpatialHash();

  constructor(private eventSystem:PubSubSystem){}

  detectCollisions(entities: ICollidable[]) {
    let flagged:{[idx:number]:boolean} = {};

    for (let i = 0; i < entities.length; i++) {
      if(flagged[i]){
        continue;
      }
      if(!entities[i].position){
        console.log('ok', i, entities[i]);
      }
      const neighbors = this.hash.getNeighboringIDsAtPos(entities[i].position, entities[i].width);
      const group = entities[i].name.split(':')[0];

      if (neighbors.length) {
        const bounds = entities[i].getBounds();
        for (let j = 0; j < neighbors.length; j++) {
          const id = neighbors[j];
          if(entities[id].name.split(':')[0] === group){
            continue;
          }

          const neighBounds = entities[id].getBounds();
          if(AABB(bounds, neighBounds)){

            entities[i].onCollision();
            // this.eventSystem.trigger('collision', { entity: entities[i], target: entities[id] });
            // this.eventSystem.trigger('collision', { entity: entities[id], target: entities[i] });

            flagged[i] = true;
            flagged[id] = true;
          }
        }
      }
    }
  }

  onAfterFrame(entities: ICollidable[]) {
    this.detectCollisions(entities);

    for (let i = 0; i < entities.length; i++) {
      this.hash.addToBuffer(i, entities[i].position);
    }
    this.hash.flip();
  }
}