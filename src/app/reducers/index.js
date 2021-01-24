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

export default combineReducers({
  language: languageReducer,
  userCells: userCellsReducer,
  userCellIds: userCellIdsReducer,
  enemyCells: enemyCellsReducer,
  enemyCellIds: enemyCellIdsReducer,
});
