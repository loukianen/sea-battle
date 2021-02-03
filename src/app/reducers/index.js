import { combineReducers } from 'redux';
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
    case 'CHANGE_CELLS':
      action.payload.forEach((element) => {
        const { coords: { x, y }, options } = element;
        options.forEach(([optionName, value]) => {
          newState[y][x][optionName] = value;
        });
      });
      return newState;
    case 'SET_DEFAULT_STYLE_FOR_CELLS':
      action.payload.forEach(({ coords: { x, y } }) => {
        newState[y][x].style = newState[y][x].defaultStyle;
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
          return [];
        case 'settingFlot':
          return makeFlot(action.payload.gameOptions);
        default:
          return state;
      }
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
});
