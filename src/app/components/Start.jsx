import React from 'react';
import $ from 'jquery';
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
  const props = { ...state };
  return props;
};

const actionCreators = {
  changeGameState: actions.changeGameState,
  showPutYourShips: actions.showPutYourShips,
};

class Start extends React.Component {
  constructor() {
    super();
    this.newGameState = null;
  }

  handleClick(e) {
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
    this.newGameState = getNewGameState(gameState);
    if (gameState === 'finished') {
      dispatch(changeGameState({ newGameState: this.newGameState, gameOptions, newGame: game }));
    }
    if (this.newGameState === 'settingFlot') {
      const newGame = new Game(gameOptions);
      dispatch(changeGameState({ newGameState: this.newGameState, gameOptions, newGame }));
    }
    if (this.newGameState === 'battleIsOn') {
      if (flot.shipIds.length !== 0) {
        dispatch(showPutYourShips());
      }
      const records = game.start({ userField, userFlot });
      dispatch(changeGameState({
        newGameState: this.newGameState, gameOptions, records, newGame: game,
      }));
    }
    $('#warningModal').modal('show');
  }

  startNewGame() {
    const { dispatch, changeGameState, gameOptions, game } = this.props;
    $('#warningModal').modal('hide');
    dispatch(changeGameState({ newGameState: this.newGameState, gameOptions, newGame: game }));
  }

  renderModal() {
    return (
      <div className="modal fade" id="warningModal" tabIndex="-1" aria-labelledby="warningModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="warningModalLabel">{i18next.t('alert.warning')}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {i18next.t('alert.areYouSureRestart')}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">{i18next.t('alert.cancel')}</button>
              <button type="button" className="btn btn-info" onClick={this.startNewGame.bind(this)}>{i18next.t('alert.continue')}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { gameState } = this.props;
    const buttonLabel = getButtonLabel(gameState);
    return (
      <div>
        {this.renderModal()}
        <li className="nav-item shadow-sm p-3 mb-3 bg-white rounded color-ship-border">
          <a
            className="btn"
            type="button"
            id="navStart"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={this.handleClick.bind(this)}
          >
            {buttonLabel}
          </a>
        </li>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Start);
