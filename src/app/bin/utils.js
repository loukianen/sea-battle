import _ from 'lodash';

const getPointAreaMapping = {
  with: ({ x, y }) => {
    const res = [];
    let curX = x - 1;
    let curY = y - 1;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        res.push({ x: curX, y: curY });
        curX += 1;
      }
      curX = x - 1;
      curY += 1;
    }
    return res;
  },
  without: ({ x, y }) => {
    const res = [];
    res.push({ x, y: y - 1 });
    res.push({ x: x - 1, y });
    res.push({ x, y });
    res.push({ x: x + 1, y });
    res.push({ x, y: y + 1 });
    return res;
  },
};

export const letters = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

export const calcArea = (data, corners = 'with') => { // corners 'with' or 'without'
  const coords = _.isArray(data) ? data : [data];
  const pointsAreas = coords.map((point) => getPointAreaMapping[corners](point));
  const areaWithShipCoords = _.uniqWith(_.flatten(pointsAreas), _.isEqual);
  const area = _.differenceWith(areaWithShipCoords, coords, _.isEqual);
  return area;
};

export const isValidCoords = (coords, minValue, maxValue) => { // coords [{}, {}] or {}
  if (_.isEmpty(coords)) {
    return false;
  }
  const coordsList = _.isArray(coords) ? coords : [coords];
  return coordsList
    .every(({ x, y }) => (x >= minValue && x <= maxValue && y >= minValue && y <= maxValue));
};

export const getActivePlayer = (records) => {
  let activePlayer;
  records.forEach((record) => {
    const [player] = record;
    activePlayer = player;
  });
  return activePlayer;
};

export const getRandomElFromColl = (arr) => {
  const index = Math.round(Math.random() * (arr.length - 1));
  return arr[index];
};

export const getFieldSize = (fieldSizeName) => {
  switch (fieldSizeName) {
    case 'ten':
      return 10;
    case 'three':
      return 3;
    default:
      throw new Error('Unknown field size');
  }
};

export const upGradeCell = (cell, actionResult) => {
  const changeMapping = {
    started: (c) => c,
    offTarget: (c) => {
      const newCell = _.cloneDeep(c);
      newCell.value = '.';
      return newCell;
    },
    wounded: (c) => {
      const newCell = _.cloneDeep(c);
      newCell.style = 'killed-ship';
      newCell.value = 'X';
      return newCell;
    },
    killed: (c) => {
      const newCell = _.cloneDeep(c);
      newCell.style = 'killed-ship';
      newCell.value = 'X';
      return newCell;
    },
  };
  return changeMapping[actionResult](cell);
};
