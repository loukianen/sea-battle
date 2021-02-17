import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import Game from '../bin/Game';

const getButtonLabel = (gameState) => {
  switch (gameState) {
    case 'choosingSettings':
      return i18next.t('ui.navStart');
    case 'settingFlot':
      return i18next.t('ui.startBattle');
    default:
      return i18next.t('ui.newGame');
  }
};

const getNewGameState = (gameState) => {
  switch (gameState) {
    case 'choosingSettings':
      return 'settingFlot';
    case 'settingFlot':
      return 'battleIsOn';
    default:
      return 'choosingSettings';
  }
};

const mapStateToProps = (state) => {
  const props = {...state};
  return props;
};

const actionCreators = {
  changeGameState: actions.changeGameState,
  showPutYourShips: actions.showPutYourShips,
};

class Start extends React.Component {
  handleClick = (e) => {
    e.preventDefault();
    const {
      dispatch,
      changeGameState,
      showPutYourShips,
      flot,
      game,
      gameOptions,
      gameState,
      userField,
      userFlot,
    } = this.props;
    const newGameState = getNewGameState(gameState);
    if (newGameState === 'settingFlot') {
      const newGame = new Game(gameOptions);
      dispatch(changeGameState({ newGameState, gameOptions, newGame }));
    } else if (newGameState === 'battleIsOn') {
      if (flot.shipIds.length !== 0) {
        dispatch(showPutYourShips());
      }
      const records = game.start({ userField, userFlot });
      dispatch(changeGameState({ newGameState, gameOptions, records, newGame: game }));
    } else {
      dispatch(changeGameState({ newGameState, gameOptions, newGame: game }));
    }
  }
  
  render() {
    const { gameState } = this.props;
    const buttonLabel = getButtonLabel(gameState);
    return(
      <li className="nav-item shadow-sm p-3 mb-3 bg-white rounded color-ship-border">
          <a className="btn" type="button" id="navStart" aria-haspopup="true" aria-expanded="false" onClick={this.handleClick}>{buttonLabel}</a>
      </li>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Start);
