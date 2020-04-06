import React from 'react';
import style from 'styled-components';


const CenteredContainer = style.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
const Countdown = style.text`
  font-size: 2em;
  font-family: 'Press Start 2P', monospace;
`;

export default class LevelStartTimer extends React.PureComponent<any,any> {

  state = {
    startTimer: 4,
  }

  componentDidMount() {
    this.tickTimer();
  }

  tickTimer = () => {
    let newValue = this.state.startTimer - 1;
    this.setState({
      startTimer: newValue,
    });

    if (newValue <= 0) {
      this.props.onCountdownEnd();
    } else {
      setTimeout(this.tickTimer, 1000);
    }
  }

  render() {
    return (
      <>
        <CenteredContainer>
          <Countdown>{ this.state.startTimer }</Countdown>
        </CenteredContainer>
      </>
    );
  }
}