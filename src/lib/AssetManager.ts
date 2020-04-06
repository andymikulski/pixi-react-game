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

  private loadedKeys:string[] = [];

  public async preloadAssets() {
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
        .on('progress', (loader, resource) => {
          loaded[resource.name] = loader.progress;


          totalProgress = Object.values(loaded).reduce((prev, curr) => {
            return prev + curr;
          }, 0) / numItems;

          console.log('total progress', totalProgress);
          this.eventSystem.trigger('assets:load:progress', totalProgress);
        })
        .once('complete', (loader, resources) => {
          this.loadedKeys = [].concat(Object.keys(resources));

          this.eventSystem.trigger('assets:load:progress', 100);
          this.eventSystem.trigger('assets:load:done');

          this.loadLowPriority();

          res();
        })
        .load();
    });
  }

  public async loadLowPriority(){
    return new Promise((res)=>{
      PIXI.Loader.shared
        .add('music', 'waterflame_daybreaker.mp3')
        .once('complete', (loader, allResources) => {
          Object.keys(allResources).forEach((resource:string) => {
            if(this.loadedKeys.indexOf(resource) === -1){
            console.log('loaded low-priority item ' + 'assets:load:' + resource);
            this.loadedKeys.push(resource);
              this.eventSystem.trigger('assets:load:' + resource);
            }
          });
          res();
        })
        .load();
    });
  }

  public async waitUntilLoaded(tag:string) {
    // If already loaded, just return immediately.
    if(this.loadedKeys.indexOf(tag) !== -1){
      return Promise.resolve();
    }

    // Else, return a promise and only kick off once the asset load event has fired.
    return new Promise((res)=>{
      this.eventSystem.once('assets:load:' + tag, ()=>{
        res();
      });
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