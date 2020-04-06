import * as PIXI from 'pixi.js';
import PIXISound from 'pixi-sound';
import PubSubSystem from '../PubSub';

export default class AssetManager {

  constructor(private eventSystem: PubSubSystem) { }

  public async startLoading() {
    return new Promise((res) => {
      let loaded: { [name: string]: number } = {};
      let totalProgress = 0;

      this.eventSystem.trigger('assets:load:start');
      PIXI.Loader.shared
        .add('player:ship', 'player.png')
        .add('carrot', 'carrot.png')
        .add('player:shoot', 'player_shoot.wav')
        .add('music', 'waterflame_daybreaker.mp3')
        .on('progress', (loader, resource) => {
          loaded[resource.name] = loader.progress;


          totalProgress = Object.values(loaded).reduce((prev, curr) => {
            return prev + curr;
          }, 0) / 4;

          console.log('total progress', totalProgress);
          this.eventSystem.trigger('assets:load:progress', totalProgress);
        })
        .once('complete', (loader, resources) => {
          this.eventSystem.trigger('assets:load:progress', 100);
          this.eventSystem.trigger('assets:load:done');
          res();
        })
        .load();
    });
  }

  public getTexture(key: string): PIXI.Texture {
    return PIXI.Loader.shared.resources[key].texture;
  }

  public getSound(key: string): PIXISound.Sound {
    return PIXI.Loader.shared.resources[key].sound;
  }
}


// function init() {
//   var sprite1 = new PIXI.Sprite(PIXI.Loader.shared.resources.image1.texture);
//   var sprite2 = new PIXI.Sprite(PIXI.Loader.shared.resources.image2.texture);
// }