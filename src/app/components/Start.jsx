import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import generateFieldData from '../bin/genFieldData';
import makeFlot from '../bin/makeFlot';
import { getFieldSize } from '../bin/utils';
import Ushakov from '../bin/Ushakov';
import game from '../bin/game';

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

const getEnemy = (enemyName) => {
  switch (enemyName) {
    case 'ushakov':
      return new Ushakov();
    default:
      throw new Error('Unknown enemy name');
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
      enemy,
      flot,
      gameOptions,
      gameState,
      userField,
      userFlot,
    } = this.props;
    const newGameState = getNewGameState(gameState);
    if (newGameState === 'settingFlot') {
      const newEnemy = getEnemy(gameOptions.enemy);
      const newField = generateFieldData(getFieldSize(gameOptions.fieldSize));
      const newFlot = makeFlot(gameOptions);
      const { ships, shipIds, field } = newEnemy.setFlot(newField, newFlot);
      const newEnemyFlot = { ships, shipIds };
      dispatch(changeGameState({ newGameState, gameOptions, newEnemy, newEnemyFlot, field }));
    } else if (newGameState === 'battleIsOn') {
      if (flot.shipIds.length !== 0) {
        dispatch(showPutYourShips());
      }
      const records = game('start', { enemy, userData: { userField, userFlot } });
      // console.log(JSON.stringify(records));
        dispatch(changeGameState({ newGameState, gameOptions, records }));
    } else {
      dispatch(changeGameState({ newGameState, gameOptions }));
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