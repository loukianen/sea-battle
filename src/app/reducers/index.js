import _ from 'lodash';
import { combineReducers } from 'redux';
import generateFieldData from '../bin/genFieldData';
import makeFlot from '../bin/makeFlot';
import * as utils from '../bin/utils';

const activePlayerReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'battleIsOn':
          return utils.getActivePlayer(action.payload.records);
        default:
          return state;
      }
    case 'SHOOT':
      return utils.getActivePlayer(action.payload.records);
    default:
      return state;
  }
};

const billboardReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return 'info.makeSetting';
        case 'settingFlot':
          return 'info.setFlot';
        case 'battleIsOn':
          switch (_.last(_.last(action.payload.records))) {
            case 'started':
              return `info.turn.${_.head(_.last(action.payload.records))}`;
            case 'wounded':
              return `info.wounded.${_.head(_.last(action.payload.records))}`;
            case 'killed':
              return `info.killed.${_.head(_.last(action.payload.records))}`;
            case 'won':
              return `info.won.${_.head(_.last(action.payload.records))}`;
            default:
              return `info.offTarget.${_.head(_.last(action.payload.records))}`;
          }
        default:
          return state;
      }
    case 'SHOOT':
      switch (_.last(_.last(action.payload.records))) {
        case 'started':
          return `info.turn.${_.head(_.last(action.payload.records))}`;
        case 'wounded':
          return `info.wounded.${_.head(_.last(action.payload.records))}`;
        case 'killed':
          return `info.killed.${_.head(_.last(action.payload.records))}`;
        case 'won':
          return `info.won.${_.head(_.last(action.payload.records))}`;
        default:
          return `info.offTarget.${_.head(_.last(action.payload.records))}`;
      }
    case 'SHOW_PUT_YOUR_SHIPS':
      return 'info.putYourShips';
    default:
      return state;
  }
};

const enemyFieldReducer = (state = {}, action) => {
  const newState = _.cloneDeep(state);
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return generateFieldData(utils.getFieldSize(action.payload.gameOptions.fieldSize));
        default:
          return state;
      }
    case 'SHOOT':
      return utils.markCells(action.payload.records, newState, 'user');
    default:
      return state;
  }
};

const flotReducer = (state = { ships: {}, shipIds: [] }, action) => {
//
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return { ships: {}, shipIds: [] };
        case 'settingFlot':
          return makeFlot(action.payload.gameOptions);
        default:
          return state;
      }
    case 'TAKE_SHIP_OUT_DOCK':
      _.unset(state.ships, action.payload.getId());
      return {
        ships: { ...state.ships },
        shipIds: _.without(state.shipIds, action.payload.getId()),
      };
    case 'RETURN_SHIP_INTO_DOCK':
      return _.isNull(action.payload.ship)
        ? state
        : ({
          ships: { ...state.ships, [action.payload.ship.getId()]: action.payload.ship },
          shipIds: [...state.shipIds, action.payload.ship.getId()],
        });
    default:
      return state;
  }
};

const gameReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return null;
        default:
          return action.payload.newGame;
      }
    case 'SHOOT':
      return action.payload.newGame;
    default:
      return state;
  }
};

const gameOptionsReducer = (state = {}) => state;

const gameStateReducer = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      return action.payload.newGameState;
    case 'SHOOT':
      if (_.last(_.last(action.payload.records)) === 'won') {
        return 'finished';
      }
      return state;
    default:
      return state;
  }
};

const languageReducer = (state = 'auto', action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return action.payload;
    default:
      return state;
  }
};

const logReducer = (state = {}, action) => {
  let lastId = _.head(_.head(state)) || 0;
  const addNewRecords = (data) => data.map(
    (item) => {
      const curId = lastId + 1;
      lastId = curId;
      return [curId, ...item];
    },
  ).reduce((acc, record) => [record, ...acc], state);

  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return [];
        case 'battleIsOn':
          return addNewRecords(action.payload.records);
        default:
          return state;
      }
    case 'SHOOT':
      return addNewRecords(action.payload.records);
    default:
      return state;
  }
};

const scoreReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return 0;
        default:
          return state;
      }
    default:
      return state;
  }
};

const shipInMoveReducer = (state = null, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return null;
        default:
          return state;
      }
    case 'TAKE_SHIP_OUT_DOCK':
      return action.payload;
    case 'PUT_SHIP_INTO_USER_DOCK':
      return null;
    case 'RETURN_SHIP_INTO_DOCK':
      return null;
    default:
      return state;
  }
};

const userFieldReducer = (state = [], action) => {
  const newState = [...state];
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return generateFieldData(utils.getFieldSize(action.payload.gameOptions.fieldSize));
        case 'battleIsOn':
          return utils.markCells(action.payload.records, newState, 'enemy');
        default:
          return state;
      }
    case 'CHANGE_CELLS':
      return utils.upGradeField(action.payload.coords, newState);
    case 'SET_DEFAULT_STYLE_FOR_CELLS':
      return utils.setDefaultStyle(action.payload, newState);
    case 'PUT_SHIP_INTO_USER_DOCK':
      return utils.upGradeField(action.payload.coords, newState);
    case 'RETURN_SHIP_INTO_DOCK':
      return utils.upGradeField(action.payload.coords, newState);
    case 'SHOOT':
      return utils.markCells(action.payload.records, newState, 'enemy');
    default:
      return state;
  }
};

const userFlotReducer = (state = { ships: {}, shipIds: [] }, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return {};
        default:
          return state;
      }
    case 'PUT_SHIP_INTO_USER_DOCK':
      return {
        ships: { ...state.ships, [action.payload.ship.getId()]: action.payload.ship },
        shipIds: [...state.shipIds, action.payload.ship.getId()],
      };
    default:
      return state;
  }
};

export default combineReducers({
  activePlayer: activePlayerReducer,
  billboard: billboardReducer,
  enemyField: enemyFieldReducer,
  flot: flotReducer,
  game: gameReducer,
  gameOptions: gameOptionsReducer,
  gameState: gameStateReducer,
  language: languageReducer,
  log: logReducer,
  score: scoreReducer,
  shipInMove: shipInMoveReducer,
  userField: userFieldReducer,
  userFlot: userFlotReducer,
});
