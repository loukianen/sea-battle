import { combineReducers } from 'redux';

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

const gameOptionsReduser = (state = {}) => state;

const gameStateReduser = (state = '') => state;

export default combineReducers({
  language: languageReducer,
  userCells: userCellsReducer,
  userCellIds: userCellIdsReducer,
  enemyCells: enemyCellsReducer,
  enemyCellIds: enemyCellIdsReducer,
  gameOptions: gameOptionsReduser,
  gameState: gameStateReduser,
});
