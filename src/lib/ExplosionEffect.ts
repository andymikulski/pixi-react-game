import * as PIXI from 'pixi.js';
import { lerp } from './Utils';
import { IFrameHandler } from './IFrameHandler';
import { ShockwaveFilter } from '@pixi/filter-shockwave';
import AssetManager from './AssetManager';

export default class ExplosionEffect extends PIXI.AnimatedSprite {

  public static Create(pos: PIXI.IPoint): ExplosionEffect {
    const sheet = AssetManager.Instance().getSpritesheet('explosion');
    const testExplosion = new ExplosionEffect(sheet.animations.frame, true);
    testExplosion.position.x = pos.x;
    testExplosion.position.y = pos.y;
    testExplosion.animationSpeed = 18 / 100;
    testExplosion.loop = false;
    testExplosion.play();
    testExplosion.onComplete = () => {
      testExplosion.destroy();
    }

    return testExplosion;
  }
}