import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './components/App.jsx';
import reducer from './reducers/index';
import generateFieldData from './bin/genFieldData';
import { getFieldSize } from './bin/utils';

export default () => {
  // eslint-disable no-underscore-dangle 
  const ext = window.__REDUX_DEVTOOLS_EXTENSION__; // uncomment for plug in
  const devtoolMiddleware = ext && ext(); // uncomment for plug in
  // eslint-enable

  const makeInitialState = () => {
    const gameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };
    const language = 'auto';
    const userField = generateFieldData(getFieldSize(gameOptions.fieldSize));
    const enemyField = generateFieldData(getFieldSize(gameOptions.fieldSize));
    const gameState = 'choosingSettings';
    const billboard = 'info.makeSetting';
    const flot = { ships: {}, shipIds: [] };
    const userFlot = { ships: {}, shipIds: [] };
    const shipInMove = null; // shipId, that took out the dock, but didn't put on the battlefield
    const log = [];
    const score = 0;
    const activePlayer = null;
    const game = null;
    return {
      activePlayer,
      billboard,
      enemyField,
      flot,
      game,
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

  // For plug in REDUX_DEVTOOLS edd third argument 'devtoolMiddleware' to 'createStore'
  const store = createStore(reducer, makeInitialState(), devtoolMiddleware);

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('main')
  );
};
