import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import App from './components/App.jsx';
import reducer from './reducers/index';
import generateFieldData from './bin/genFieldData';
import makeFlot from './bin/makeFlot';
import Ushakov from './bin/Ushakov';

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
};

export default () => {
  // eslint-disable no-underscore-dangle 
  const ext = window.__REDUX_DEVTOOLS_EXTENSION__;
  const devtoolMiddleware = ext && ext();
  // eslint-enable

  const gameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };
  const enemy = new Ushakov();

  const initialState = {
    language: 'auto',
    userField: generateFieldData(),
    enemyField: makeBattlefild(generateFieldData(), enemy, gameOptions),
    gameOptions,
    gameState: 'choosingSettings',
    flot: { ships: {}, shipIds: [] },
    userFlot: {},
    shipInMove: null, // shipId, that took out the dock, but didn't put on the battlefield
  };

  const store = createStore(reducer, initialState, devtoolMiddleware);

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('main')
  );
};
