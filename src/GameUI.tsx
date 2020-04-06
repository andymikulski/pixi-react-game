import React from 'react';
import PubSubSystem from './PubSub';
import { LevelOne } from './lib/GameLevel';
import GamePlayer from './lib/GamePlayer';
import style from 'styled-components';

const UIContainer = style.div`
  font-family: 'Press Start 2P', monospace;
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1em;
  color: #fff;
`;

const StatsContainer = style.div`
  font-family: 'Press Start 2P', monospace;
  z-index: 10;
  position: fixed;
  bottom: 1em;
  left: 1em;
  color: #fff;
`

export default class GameUI extends React.PureComponent<any, any> {
  render() {
    return (
      <>
        <UIContainer>
          <button onClick={() => {
            this.props.onTogglePause();
          }}>Pause</button>

          <br />
          <br />
          <br />
            Game speed: {this.props.gameSpeed.toFixed(2)}
          <br />
          <button onClick={() => {
            this.props.onSpeedChange(-0.1);
          }}>Slower</button>
          <button onClick={() => {
            this.props.onSpeedChange(0.1);
          }}>Faster</button>
        </UIContainer>

        <StatsContainer>
          Carrots fired: {this.props.carrotsFired}
        </StatsContainer>
      </>
    );
  }
}