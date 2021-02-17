import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './components/App.jsx';
import reducer from './reducers/index';
import generateFieldData from './bin/genFieldData';
import makeFlot from './bin/makeFlot';
import { getFieldSize } from './bin/utils';
import Ushakov from './bin/Ushakov';

const ushakov = new Ushakov();
const newFlot = makeFlot({ fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' });
const newField = generateFieldData();
const { ships, shipIds, field } = ushakov.setFlot(newField, newFlot);

export default () => {
  // eslint-disable no-underscore-dangle 
  const ext = window.__REDUX_DEVTOOLS_EXTENSION__;
  const devtoolMiddleware = ext && ext();
  // eslint-enable

  const makeInitialState = () => {
    const gameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };
    // const game = new Game(gameOptions);
    const language = 'auto';
    const userField = field; // generateFieldData(getFieldSize(gameOptions.fieldSize));
    const enemyField = generateFieldData(getFieldSize(gameOptions.fieldSize)); // makeBattlefild(generateFieldData(), enemy, gameOptions);
    const gameState = 'settingFlot'; // choosingSettings'; // 'battleIsOn';
    const billboard = 'info.makeSetting';
    const flot = { ships: {}, shipIds: [] };
    const userFlot = { ships, shipIds};
    const shipInMove = null; // shipId, that took out the dock, but didn't put on the battlefield
    const enemy = new Ushakov(); // null;
    const { ships: s, shipIds: si, field: f } = enemy.setFlot(generateFieldData(), makeFlot(gameOptions));
    const enemyFlot =  { ships: s, shipIds: si }; // null;
    const enemyMap = f; // null;
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
