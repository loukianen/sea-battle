import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

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
  const { language, gameState, gameOptions } = state;
  const props = { language, gameState, gameOptions };
  return props;
};

const actionCreators = {
  changeGameState: actions.changeGameState,
};

class Start extends React.Component {
  handleClick = (e) => {
    e.preventDefault();
    const {
      dispatch,
      changeGameState,
      gameState,
      gameOptions,
    } = this.props;
    const newGameState = getNewGameState(gameState);
    dispatch(changeGameState(newGameState, gameOptions));
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