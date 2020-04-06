import * as PIXI from 'pixi.js';
import { lerp } from './Utils';
import { IFrameHandler } from './IFrameHandler';
import {ShockwaveFilter} from '@pixi/filter-shockwave';

export default class ShockwaveEffect extends ShockwaveFilter implements IFrameHandler {

  public static Create(pos:PIXI.IPoint):ShockwaveEffect {
    const eff = new ShockwaveEffect(new PIXI.Point(pos.x, pos.y), {
      amplitude: 50 ,
      brightness: 0.75,
      radius: 100,
      speed: 200,
      wavelength: 75,
    });

    // eff.blendMode = PIXI.BLEND_MODES.OVERLAY;
    eff.time = 0;

    return eff;
  }

  public update(dt:number):void {
    this.time = lerp(this.time, 1, dt / 100);
  }
}