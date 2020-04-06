import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game';
import PubSubSystem from './PubSub';
import { LevelOne } from './lib/GameLevel';
import GamePlayer from './lib/GamePlayer';
import GameUI from './GameUI';
import LevelStartTimer from './LevelStartTimer';
import LoadingUI from './LoadingUI';

class App extends React.PureComponent {
  events = new PubSubSystem();


  state = {
    carrotsFired: 0,
    showTimer: false,
    startTimer: 3,
    showUI: false,
    isPaused: false,
    gameSpeed: 1,
    isLoading: false,
    loadingProgress: 0,
    currentLevel: new LevelOne(),
  };

  componentDidMount() {
    this.events.on('player:fired', ()=>{
      this.setState({
        carrotsFired: this.state.carrotsFired + 1,
      });
    });

    this.events.on('assets:load:start', ()=>{
      this.setState({
        isLoading: true,
      });
    });
    this.events.on('assets:load:progress', (val:number)=>{
      this.setState({
        loadingProgress: val,
      });
    });
    this.events.on('assets:load:done', ()=>{
      this.setState({
        loadingProgress: 100,
      });

      setTimeout(()=>{
        this.setState({
          isLoading: false,
        });
      }, 100);
    });
  }

  render() {
    return (
      <div>
        {
          !this.state.showTimer && !this.state.showUI &&
          <button onClick={this.startGame}>Start Game</button>
        }

        {
          this.state.isLoading &&
          <LoadingUI progress={this.state.loadingProgress} />
        }

        {
          this.state.showUI &&
          <GameUI
            isPaused={this.state.isPaused}
            gameSpeed={this.state.gameSpeed}
            carrotsFired={this.state.carrotsFired}

            onSpeedChange={(val:number)=>{
              this.setState({
                gameSpeed: this.state.gameSpeed + val,
              });
            }}
            onTogglePause={()=>{
              this.setState({
                isPaused: !this.state.isPaused
              });
            }}
          />
        }

        {
          this.state.showTimer &&
          <LevelStartTimer onCountdownEnd={this.startGame} />
        }

        <Game
          eventSystem={this.events}
          level={this.state.currentLevel}
          paused={this.state.isPaused}
          visible={this.state.showUI}
          timeStep={this.state.gameSpeed}
        />
      </div>
    );
  }

  private startCountdown = () => {
    this.setState({
      showTimer: true,
    });
  }

  private startGame = () => {
    this.setState({
      showTimer: false,
      showUI: true,
    }, () => {
      this.events.trigger('game:start');
    });
  }
};

const run = () => {
  ReactDOM.render(<App />, document.querySelector('#main'));
};

run();