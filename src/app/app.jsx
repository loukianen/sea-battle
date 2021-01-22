import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import App from './components/App.jsx';
import reducer from './reducers/index';
import generateFieldData from './bin/genFieldData';

export default () => {
  // eslint-disable no-underscore-dangle 
  const ext = window.__REDUX_DEVTOOLS_EXTENSION__;
  const devtoolMiddleware = ext && ext();
  // eslint-enable

  const { cells: userCells, cellIds: userCellIds } = generateFieldData();
  const { cells: enemyCells, cellIds: enemyCellIds } = generateFieldData();

  const initialState = {
    language: 'auto',
    userCells: userCells,
    userCellIds: userCellIds,
    enemyCells: enemyCells,
    enemyCellIds: enemyCellIds,
  };

  const store = createStore(reducer, initialState, devtoolMiddleware);

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('main')
  );
};