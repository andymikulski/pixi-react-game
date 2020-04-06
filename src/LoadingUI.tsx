import React from 'react';
import PubSubSystem from './PubSub';
import GamePlayer from './lib/GamePlayer';
import style from 'styled-components';


const LoadingBarContainer = style.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 50;
  width: 500px;
  z-index: 500;
`;

const LoadingBar:any = style.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: red;
  width: ${(props:any) => props.progress}%;
  transition: 0.2s all ease -0.1s;
`;

export default class LoadingUI extends React.PureComponent<any, any> {

  render() {
    return (
      <>
        <LoadingBarContainer>
          <LoadingBar progress={this.props.progress} />
        </LoadingBarContainer>
      </>
    );
  }
}