import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './components/App.jsx';
import reducer from './reducers/index';
import generateFieldData from './bin/genFieldData';
import makeFlot from './bin/makeFlot';
import { getFieldSize } from './bin/utils';
// import Game from './bin/game';
/*
const makeBattlefild = (field, ai, options) => {
  const flot = ai.setFlot(field, makeFlot(options));
  const battlefield = field;
  const { ships, shipIds } = flot;
  shipIds.forEach((id) => {
    const coords = ships[id].getCoords();
    coords.forEach(({ x, y }) => {
      battlefield[y][x].style = 'ship';
      battlefield[y][x].shipId = id;
      // console.log(`Cell ${x} ${y}: ${JSON.stringify(battlefield[y][x])}`);
    });
  });
  return battlefield;
};*/

export default () => {
  // eslint-disable no-underscore-dangle 
  const ext = window.__REDUX_DEVTOOLS_EXTENSION__;
  const devtoolMiddleware = ext && ext();
  // eslint-enable

  const makeInitialState = () => {
    const gameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };
    // const game = new Game(gameOptions);
    const language = 'auto';
    const userField = generateFieldData(getFieldSize(gameOptions.fieldSize));
    const enemyField = generateFieldData(getFieldSize(gameOptions.fieldSize)); // makeBattlefild(generateFieldData(), enemy, gameOptions);
    const gameState = 'choosingSettings'; // 'battleIsOn';
    const billboard = 'info.makeSetting';
    const flot = { ships: {}, shipIds: [] };
    const userFlot = {};
    const shipInMove = null; // shipId, that took out the dock, but didn't put on the battlefield
    const enemy = null;
    const enemyFlot = null;
    const enemyMap = null;
    const log = [];
    const score = 0;
    const activePlayer = null;
    return {
      activePlayer,
      billboard,
      enemy,
      enemyField,
      enemyFlot,
      enemyMap,
      flot,
      gameOptions,
      gameState,
      language,
      log,
      score,
      shipInMove,
      userField,
      userFlot,
    };
  };

  const store = createStore(reducer, makeInitialState(), devtoolMiddleware);

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('main')
  );
};
