export const changeCells = (data) => ({
  type: 'CHANGE_CELLS',
  payload: data,
});

export const changeGameState = (data) => ({
  type: 'CHANGE_GAMESTATE',
  payload: data,
});

export const putShipIntoUserDock = (data) => ({
  type: 'PUT_SHIP_INTO_USER_DOCK',
  payload: data,
});

export const returnShipIntoDock = (data) => ({
  type: 'RETURN_SHIP_INTO_DOCK',
  payload: data,
});

export const setDefaultStyleForCells = (data) => ({
  type: 'SET_DEFAULT_STYLE_FOR_CELLS',
  payload: data,
});

export const setLanguage = (lang) => ({
  type: 'SET_LANGUAGE',
  payload: lang,
});

export const setOptions = () => ({
  type: 'SET_OPTIONS',
});

export const shoot = (data) => ({
  type: 'SHOOT',
  payload: data,
});

export const showPutYourShips = () => ({
  type: 'SHOW_PUT_YOUR_SHIPS',
});

export const startBattle = () => ({
  type: 'START_BATTLE',
});

export const takeShipOutDock = (ship) => ({
  type: 'TAKE_SHIP_OUT_DOCK',
  payload: ship,
});
