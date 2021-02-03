import { combineReducers } from 'redux';

const languageReducer = (state = 'auto', action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return action.payload;
    default:
      return state;
  }
};

const userFieldReducer = (state = [], action) => {
  switch (action.type) {
    case 'CHANGE_CELLS':
      const newState = [...state];
      action.payload.forEach(element => {
        const { coords: { x, y }, options } = element;
        options.forEach(([optionName, value]) => {
          newState[y][x][optionName] = value;
          
        });
      });
      return newState;
    case 'SET_DEFAULT_STYLE_FOR_CELLS':
      const setDefaultState = [...state];
      action.payload.forEach(({ coords: { x, y } }) => {
        setDefaultState[y][x].style = setDefaultState[y][x].defaultStyle;
        console.log(JSON.stringify(setDefaultState[y][x].style));
      });
      return setDefaultState;
    default:
      return state;
  }
}
/*
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
*/
// const enemyCellsReducer = (state = {}) => state;

// const enemyCellIdsReducer = (state = {}) => state;

const enemyFieldReducer = (state = {}) => state;

const gameOptionsReduser = (state = {}) => state;

const gameStateReduser = (state = '') => state;

export default combineReducers({
  language: languageReducer,
  userField: userFieldReducer,
  enemyField: enemyFieldReducer,
  // userCells: userCellsReducer,
  // userCellIds: userCellIdsReducer,
  // enemyCells: enemyCellsReducer,
  // enemyCellIds: enemyCellIdsReducer,
  gameOptions: gameOptionsReduser,
  gameState: gameStateReduser,
});
