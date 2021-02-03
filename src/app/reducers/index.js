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

const userCellsReducer = (state = {}) => state;

const userCellIdsReducer = (state = {}) => state;

const enemyCellsReducer = (state = {}) => state;

const enemyCellIdsReducer = (state = {}) => state;

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
          console.log(`From flotReduser: ${JSON.stringify(action.payload.gameOptions)}`);
          return makeFlot(action.payload.gameOptions);
        default:
          return state;
      };
    default:
      return state;
  }
};

export default combineReducers({
  language: languageReducer,
  userCells: userCellsReducer,
  userCellIds: userCellIdsReducer,
  enemyCells: enemyCellsReducer,
  enemyCellIds: enemyCellIdsReducer,
  gameOptions: gameOptionsReducer,
  gameState: gameStateReducer,
  flot: flotReducer,
});
