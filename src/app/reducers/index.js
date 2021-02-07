import _ from 'lodash';
import { combineReducers } from 'redux';
import generateFieldData from '../bin/genFieldData';
import makeFlot from '../bin/makeFlot';

const languageReducer = (state = 'auto', action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return action.payload;
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
          return generateFieldData();
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

const enemyFieldReducer = (state = {}) => state;

const gameOptionsReducer = (state = {}) => state;

const gameStateReducer = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_GAMESTATE':
      return action.payload.newGameState;
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

const userFlotReducer = (state = {}, action) => {
  switch (action.type) {
    case 'PUT_SHIP_INTO_USER_DOCK':
      return { ...state, [action.payload.ship.getId()]: action.payload.ship };
    default:
      return state;
  }
};

const shipInMoveReducer = (state = null, action) => {
  switch (action.type) {
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

export default combineReducers({
  language: languageReducer,
  userField: userFieldReducer,
  enemyField: enemyFieldReducer,
  gameOptions: gameOptionsReducer,
  gameState: gameStateReducer,
  flot: flotReducer,
  userFlot: userFlotReducer,
  shipInMove: shipInMoveReducer,
});
