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
  userField: userFieldReducer,
  enemyField: enemyFieldReducer,
  gameOptions: gameOptionsReducer,
  gameState: gameStateReducer,
  flot: flotReducer,
});
