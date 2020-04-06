import * as PIXI from 'pixi.js';
import PIXISound from 'pixi-sound';
import PubSubSystem from '../PubSub';

export default class AssetManager {

  private static _ass:AssetManager;
  public static Instance() {
    return AssetManager._ass;
  }

  constructor(private eventSystem: PubSubSystem) {
    AssetManager._ass = this;
  }

  public async startLoading() {
    return new Promise((res) => {
      let loaded: { [name: string]: number } = {};
      let totalProgress = 0;
      let numItems = 7;

      this.eventSystem.trigger('assets:load:start');
      PIXI.Loader.shared
        .add('explosion', 'assets/explosion.json')
        .add('player:ship', 'player.png')
        .add('player:bullet', 'carrot.png')
        .add('player:shoot', 'player_shoot.wav')
        .add('enemy:ship', 'enemy.png')
        .add('enemy:bullet', 'enemy-bullet.png')
        .add('music', 'waterflame_daybreaker.mp3')
        .on('progress', (loader, resource) => {
          loaded[resource.name] = loader.progress;


          totalProgress = Object.values(loaded).reduce((prev, curr) => {
            return prev + curr;
          }, 0) / numItems;

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

  public getSpritesheet(key:string):PIXI.Spritesheet {
    return PIXI.Loader.shared.resources[key].spritesheet;
  }
}


// function init() {
//   var sprite1 = new PIXI.Sprite(PIXI.Loader.shared.resources.image1.texture);
//   var sprite2 = new PIXI.Sprite(PIXI.Loader.shared.resources.image2.texture);
// }