import { combineReducers } from 'redux';

const languageReducer = (state = 'auto', action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return action.payload;
    default:
      return state;
  }
};

const userCellsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_CELLS':
      const newState = state;
      action.payload.forEach(element => {
        const { id, options } = element;
        options.forEach(([optionName, value]) => {
          newState[id][optionName] = value;
        });
      });
      return newState;
    case 'SET_DEFAULT_STYLE_FOR_CELLS':
      const setDefaultState = state;
      action.payload.forEach((cellId) => {
        setDefaultState[cellId].style = setDefaultState[cellId].defaultStyle;
      });
    default:
      return state;
  }
}

const userCellIdsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_CELLS':
      return [...state];
    case 'SET_DEFAULT_STYLE_FOR_CELLS':
      return [...state];
    default:
      return state;
  }
}

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
