import React from 'react';

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
        <h2>{this.state.startTimer}</h2>
      </>
    );
  }
}