import _ from 'lodash';
import { combineReducers } from 'redux';
import generateFieldData from '../bin/genFieldData';
import makeFlot from '../bin/makeFlot';
import { getFieldSize, getActivePlayer, upGradeCell } from '../bin/utils';

const activePlayerReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'battleIsOn':
          return getActivePlayer(action.payload.records);
        default:
          return state;
      }
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
          return 'info.killEnemy';
        default:
          return state;
      }
    case 'SHOW_PUT_YOUR_SHIPS':
      return 'info.putYourShips';
    default:
      return state;
  }
};

const enemyReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return null;
        case 'settingFlot':
          return action.payload.newEnemy;
        default:
          return state;
      }
    default:
      return state;
  }
};

const enemyFieldReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return generateFieldData(getFieldSize(action.payload.gameOptions.fieldSize));
        default:
          return state;
      }
    default:
      return state;
  }
};

const enemyFlotReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return null;
        case 'settingFlot':
          return action.payload.newEnemyFlot;
        default:
          return state;
      }
    default:
      return state;
  }
};

const enemyMapReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return null;
        case 'settingFlot':
          return action.payload.field;
        default:
          return state;
      }
    default:
      return state;
  }
};

const flotReducer = (state = {}, action) => {
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
        ships: state.ships,
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

const gameOptionsReducer = (state = {}) => state;

const gameStateReducer = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      return action.payload.newGameState;
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
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return [];
        case 'battleIsOn':
          return action.payload.records.reduce((acc, record) => [record, ...acc], state);
        default:
          return state;
      }
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
          return generateFieldData(getFieldSize(action.payload.gameOptions.fieldSize));
        case 'battleIsOn':
          return action.payload.records.forEach((record) => {
            const [player, coords, result] = record;
            if (player === 'enemy') {
              const { x, y } = coords;
              const cell = newState[y][x];
              newState[y][x] = upGradeCell(cell, result);
            }
            return newState;
          });
        default:
          return state;
      }
    case 'CHANGE_CELLS':
      action.payload.forEach((element) => {
        const { coords: { x, y }, options } = element;
        options.forEach(([optionName, value]) => {
          newState[y][x][optionName] = value;
        });
      });
      return newState;
    case 'SET_DEFAULT_STYLE_FOR_CELLS':
      action.payload.forEach(({ x, y }) => {
        newState[y][x].style = newState[y][x].defaultStyle;
      });
      return newState;
    case 'PUT_SHIP_INTO_USER_DOCK':
      action.payload.coords.forEach((element) => {
        const { coords: { x, y }, options } = element;
        options.forEach(([optionName, value]) => {
          newState[y][x][optionName] = value;
        });
      });
      return newState;
    case 'RETURN_SHIP_INTO_DOCK':
      action.payload.coords.forEach((element) => {
        const { coords: { x, y }, options } = element;
        options.forEach(([optionName, value]) => {
          newState[y][x][optionName] = value;
        });
      });
      return newState;
    default:
      return state;
  }
};

const userFlotReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      switch (action.payload.newGameState) {
        case 'choosingSettings':
          return {};
        default:
          return state;
      }
    case 'PUT_SHIP_INTO_USER_DOCK':
      return { ...state, [action.payload.ship.getId()]: action.payload.ship };
    default:
      return state;
  }
};

export default combineReducers({
  activePlayer: activePlayerReducer,
  billboard: billboardReducer,
  enemy: enemyReducer,
  enemyField: enemyFieldReducer,
  enemyFlot: enemyFlotReducer,
  enemyMap: enemyMapReducer,
  flot: flotReducer,
  // game: gameReducer,
  gameOptions: gameOptionsReducer,
  gameState: gameStateReducer,
  language: languageReducer,
  log: logReducer,
  score: scoreReducer,
  shipInMove: shipInMoveReducer,
  userField: userFieldReducer,
  userFlot: userFlotReducer,
});
