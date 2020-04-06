import * as PIXI from 'pixi.js';
import { lerp } from './Utils';
import { IFrameHandler } from './IFrameHandler';
import {CRTFilter} from '@pixi/filter-crt';

export default class CRTEffect extends CRTFilter implements IFrameHandler {

  public static Create():CRTEffect {
    const eff = new CRTEffect({
      curvature: 0,
      vignetting: 0.35,
      vignettingAlpha: 0.12, //  0.025,
      lineContrast: 0.15,
    });

    return eff;
  }

  public update(dt:number):void {
    // this.time = lerp(this.time, 1, dt / 100);
    this.time += (dt / 5);
  }
}