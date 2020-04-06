import React from 'react';
import * as PIXI from 'pixi.js';
import PIXISound from 'pixi-sound';
import PubSubSystem from './PubSub';
import GameLevel from './lib/GameLevel';
import { StateMachine } from './lib/StateMachine';
import GamePlayer from './lib/GamePlayer';
import { IFrameHandler } from './lib/IFrameHandler';
import GameProjectile, { BasicBullet, HomingBullet } from './lib/GameProjectile';
import ShockwaveEffect from './lib/ShockwaveEffect';
import ScrollingSprite from './lib/ScrollingSprite';
import CRTEffect from './lib/CRTEffect';
import { IAfterFrameHandler } from './lib/IAfterFrameHandler';
import CollisionSystem from './lib/CollisionSystem';
import { ICollidable } from './lib/ICollidable';
import AssetManager from './lib/AssetManager';
import GameEnemy from './lib/GameEnemy';
import ExplosionEffect from './lib/ExplosionEffect';

// const PLAYER_DEATH_ANIM = require('./assets/player-death.anim').default;

export type GameProps = {
  eventSystem: PubSubSystem,
  level: GameLevel,

  visible: boolean,
  paused: boolean,
  timeStep: number,
};


export default class Game extends React.PureComponent<GameProps, {}> {


  private assetManager: AssetManager;

  static SCREEN_WIDTH = window.innerWidth;
  static SCREEN_HEIGHT = window.innerHeight;

  static defaultProps = {
    visible: true,
    paused: false,
    timeStep: 1,
  };

  entities: IFrameHandler[] = [];

  collidables: ICollidable[] = [];

  onAfterFrames: IAfterFrameHandler[] = [];

  app: PIXI.Application;

  public get stage(): PIXI.Container {
    return this.app.stage;
  }

  fsm: StateMachine = new StateMachine();
  player: GamePlayer;

  bullets: PIXI.Sprite[] = [];

  grid: ScrollingSprite;

  constructor(props: any) {
    super(props);

    this.assetManager = new AssetManager(this.props.eventSystem);

    this.app = new PIXI.Application({
      width: Game.SCREEN_WIDTH,
      height: Game.SCREEN_HEIGHT,
      antialias: false,
      backgroundColor: 0x123456,
    });

    this.player = GamePlayer.Create(this.props.eventSystem);

    this.props.eventSystem.on('game:start', async () => {
      await this.assetManager.preloadAssets();
      this.start();
    });

    this.props.eventSystem.on('enemy:died', (entity: GameEnemy) => {
      const exp = ExplosionEffect.Create(entity.position);
      const filter = ShockwaveEffect.Create(entity.position);

      entity.alpha = 0;

      this.stage.addChild(exp);
      this.entities.push(filter);
      this.grid.filters.push(filter);
    });


    const homingBehavior = new HomingBullet(this.player);
    const makeHomingBullet = (tag: string) => {
      const proj = GameProjectile.Create(
        homingBehavior,
        this.assetManager.getTexture(tag)
      );
      proj.name = tag;
      return proj;
    }

    this.props.eventSystem.on('enemy:fire', (entity: GameEnemy) => {
      // const bullet = GameProjectile.Create(this.player, this.assetManager.getTexture('enemy:bullet'));
      // bullet.name = 'enemy:bullet';
      const bullet = makeHomingBullet('enemy:bullet');
      bullet.width = 33;
      bullet.height = 12;
      bullet.speed = 2;
      bullet.position.x = entity.position.x;
      bullet.position.y = entity.position.y;
      bullet.rotation = entity.rotation;

      this.stage.addChild(bullet);
      this.entities.push(bullet);
      this.collidables.push(bullet);
    });
  }

  componentDidUpdate(prevProps: GameProps) {
    if (prevProps.paused !== this.props.paused) {
      if (this.props.paused) {
        this.app.ticker.stop();
        this.stage.interactive = false;
      } else {
        this.app.ticker.start();
        this.stage.interactive = true;
      }
    }

    if (prevProps.timeStep !== this.props.timeStep) {
      this.app.ticker.speed = this.props.timeStep;
    }
  }

  start = () => {
    var bg = PIXI.Texture.from(require('./background.gif').default);
    var background = new ScrollingSprite(bg, 0.5, 0);// new PIXI.Sprite(bg);
    background.width = Game.SCREEN_WIDTH;
    background.height = Game.SCREEN_HEIGHT;
    background.position.set(0, 0);
    this.stage.addChild(background);
    this.entities.push(background);

    var gridTex = PIXI.Texture.from(require('./grid.jpg').default);
    var grid = new ScrollingSprite(gridTex, 1.1, 0);
    grid.width = Game.SCREEN_WIDTH;
    grid.height = Game.SCREEN_HEIGHT;
    grid.position.set(0, 0);
    grid.blendMode = PIXI.BLEND_MODES.SCREEN;
    grid.alpha = 0.25;
    grid.filters = [];
    this.stage.addChild(grid);
    this.entities.push(grid);

    this.grid = grid;
    this.stage.interactive = true;

    this.stage.addChild(this.player);
    this.entities.push(this.player);


    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const enemy = GameEnemy.Create(this.props.eventSystem, this.player);
        enemy.position.set(Math.random() * Game.SCREEN_WIDTH, -50);
        enemy.rotation = Math.PI / 2;
        enemy.setPosition(enemy.position.x, Game.SCREEN_HEIGHT * 0.1);

        this.stage.addChild(enemy);
        this.entities.push(enemy);
        this.collidables.push(enemy);
      }, i * 333);
    }



    const shootSound = this.assetManager.getSound('player:shoot');

    console.log('checking for music..');
    this.assetManager.waitUntilLoaded('music').then(() => {
      console.log('we have music..');
      const music = this.assetManager.getSound('music');
      music.filters = [new PIXISound.filters.TelephoneFilter()];
      music.volume = 0.25;
      music.play();
    });

    const cd = new CollisionSystem(this.props.eventSystem);
    // this.onAfterFrames.push(cd);


    const { app: { renderer, stage } } = this;

    this.app.ticker.add((delta: number) => {
      for (let i = 0; i < this.entities.length; i++) {
        this.entities[i].update(delta);
      }

      // for(let j = 0; j < this.onAfterFrames.length; j++){
      //   this.onAfterFrames[j].onAfterFrame(this.collidables);
      // }

      cd.onAfterFrame(this.collidables);
    });


    // // move the sprite to the center of the screen
    this.player.position.x = Game.SCREEN_WIDTH / 2;
    this.player.position.y = Game.SCREEN_HEIGHT / 2;
    this.player.rotation = -Math.PI / 2;
    this.player.setPosition(this.player.position.x, this.player.position.y);

    this.collidables.push(this.player);

    // stage.addChild(bunny);

    // stage.interactive = true;

    stage.on("pointerdown", (e: PIXI.interaction.InteractionEvent) => {
      shoot(this.player.rotation, {
        x: this.player.position.x + Math.cos(this.player.rotation) * 20,
        y: this.player.position.y + Math.sin(this.player.rotation) * 20
      });
    })

    stage.on("pointermove", (e: PIXI.interaction.InteractionEvent) => {
      this.player.setPosition(
        e.data.global.x,
        e.data.global.y);
      // 1024 - Math.min(Math.max(0, e.data.global.y), 1024 * 0.1));
    })

    const crt = CRTEffect.Create();
    this.stage.filters = [
      crt,
    ];
    this.entities.push(crt);

    let lastShot = -Infinity;
    let now;


    const basicBehavior = new BasicBullet();
    const makeBasicBullet = (tag: string) => {
      const proj = GameProjectile.Create(
        basicBehavior,
        this.assetManager.getTexture(tag)
      );
      proj.name = tag;

      return proj;
    }

    const shoot = (rotation: number, startPosition: { x: number; y: number }) => {
      now = Date.now();
      if (now - lastShot < (1000 / this.player.shootPerSec)) {
        return;
      }
      lastShot = now;
      // const bullet = GameProjectile.Create(this.player, this.assetManager.getTexture('carrot'));
      const bullet = makeBasicBullet('player:bullet');
      bullet.width = 33;
      bullet.height = 12;
      bullet.speed = 5;
      bullet.position.x = startPosition.x;
      bullet.position.y = startPosition.y;
      bullet.rotation = rotation;

      stage.addChild(bullet);
      this.entities.push(bullet);
      this.collidables.push(bullet);

      this.props.eventSystem.trigger('player:fired');

      shootSound.play();

      const filter = ShockwaveEffect.Create(this.player.position);
      this.entities.push(filter);
      this.grid.filters.push(filter);
      // this.stage.filters.push(filter);
    }

    function rotateToPoint(mx: number, my: number, px: number, py: number) {
      var dist_Y = my - py;
      var dist_X = mx - px;
      var angle = Math.atan2(dist_Y, dist_X);
      //var degrees = angle * 180/ Math.PI;
      return angle;
    }

    // PIXI.Loader.shared
    //   .add('assets/explosion.json') //    "images/spritesheet.json")
    //   .load(() => {
    //     this.app.start();

    //     let sheet = PIXI.Loader.shared.resources['assets/explosion.json'].spritesheet;

    // let anim = sheet.animations['assets/explosion.json'];
    // const testExplosion = new PIXI.AnimatedSprite(sheet.animations.frame, true);
    // testExplosion.position.x = Game.SCREEN_WIDTH / 2;
    // testExplosion.position.y = Game.SCREEN_HEIGHT / 2;
    // testExplosion.animationSpeed = 18 / 100;
    // testExplosion.loop = false;
    // testExplosion.play();
    // testExplosion.onComplete = () => {
    //   testExplosion.destroy();
    // }
    // this.stage.addChild(testExplosion);

    //     const filter = ShockwaveEffect.Create(testExplosion.position);
    //     this.entities.push(filter);
    //     this.stage.filters.push(filter);
    //   });
    // this.app.stop();

    // animatedCapguy = new PIXI.extras.AnimatedSprite(sheet.animations["capguy"]);
    // // set speed, start playback and add it to the stage
    // animatedCapguy.animationSpeed = 0.167;
    // animatedCapguy.play();
    // app.stage.addChild(animatedCapguy);

  }

  onContainerMount(container: HTMLDivElement) {
    if (container) {
      container.appendChild(this.app.renderer.view);
    }
  }

  render() {
    return (
      <div style={{ visibility: this.props.visible ? 'visible' : 'hidden' }} ref={(ref) => this.onContainerMount(ref)} />
    )
  }
}