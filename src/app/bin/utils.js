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

export const initialGameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };

export const calcArea = (data, corners = 'with') => { // corners 'with' or 'without'
  const coords = _.isArray(data) ? data : [data];
  const pointsAreas = coords.map((point) => getPointAreaMapping[corners](point));
  const areaWithShipCoords = _.uniqWith(_.flatten(pointsAreas), _.isEqual);
  const area = _.differenceWith(areaWithShipCoords, coords, _.isEqual);
  return area;
};

export const isValidCoords = (coords, minValue, maxValue) => { // coords [{}, {}] or {}
  // console.log(coords, minValue, maxValue);
  if (_.isEmpty(coords)) {
    return false;
  }
  const coordsList = _.isArray(coords) ? coords : [coords];
  return coordsList
    .every(({ x, y }) => (x >= minValue && x <= maxValue && y >= minValue && y <= maxValue));
};

export const isValidField = (battleField) => {
  const maxValue = battleField.length - 1;
  return battleField.every((line) => {
    line.every((cell) => {
      const { style, shipId, coords } = cell;
      if (style === 'ship') {
        const area = calcArea(coords).filter((item) => isValidCoords(item, 0, maxValue));
        return area.every((areaCell) => (areaCell.style !== 'ship' || areaCell.shipId === shipId));
      }
      return true;
    });
    return true;
  });
};

export const calcShips = (battleField) => {
  const shipIds = new Set();
  const fieldSize = battleField.length;
  for (let row = 0; row < fieldSize; row += 1) {
    for (let col = 0; col < fieldSize; col += 1) {
      const currentCell = battleField[row][col];
      if (currentCell.style === 'ship') {
        shipIds.add(currentCell.shipId);
      }
    }
  }
  return shipIds.size;
};

export const getCompetitor = (player) => (player === 'user' ? 'enemy' : 'user');

export const getActivePlayer = (records) => {
  let activePlayer;
  records.forEach((record) => {
    const [player, , result] = record;
    activePlayer = result !== 'offTarget' ? player : getCompetitor(player);
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
    case 'seven':
      return 7;
    case 'five':
      return 5;
    case 'three':
      return 3;
    default:
      throw new Error('Unknown field size');
  }
};

const evaluateResult = (result) => {
  switch (result) {
    case 'offTarget':
      return -1;
    case 'wounded':
      return 10;
    case 'killed':
      return 15;
    default:
      return 0;
  }
};

export const getScore = (records) => records.reduce((acc, [player, , result]) => {
  const value = evaluateResult(result);
  return player === 'user' ? acc + value : acc - value;
}, 0);

export const upGradeCell = (cell, actionResult) => {
  const changeMapping = {
    offTarget: (c) => {
      const newCell = _.cloneDeep(c);
      newCell.value = 'point';
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

export const markCells = (data, state, fieldOwner) => {
  const newState = state;
  data.forEach((record) => {
    const [player, coords, result, additionalData] = record;
    if (player === fieldOwner && coords !== null) {
      const { x, y } = coords;
      const cell = newState[y][x];
      newState[y][x] = upGradeCell(cell, result);
    }
    if (fieldOwner === 'user' && result === 'won' && additionalData) {
      additionalData.forEach((line, y) => line.forEach((cell, x) => {
        if (cell.style === 'ship' && newState[y][x].style !== 'killed-ship') {
          newState[y][x].style = 'ship';
        }
      }));
    }
    if (fieldOwner === 'user' && result === 'killed' && additionalData) {
      const area = calcArea(additionalData);
      const validArea = area.filter((item) => isValidCoords(item, 1, newState.length - 1));
      validArea.forEach(({ x, y }) => {
        const cell = newState[y][x];
        newState[y][x] = upGradeCell(cell, 'offTarget');
      });
    }
  });
  return newState;
};

export const upGradeField = (data, state) => {
  const newState = state;
  data.forEach((element) => {
    const { coords: { x, y }, options } = element;
    options.forEach(([optionName, value]) => {
      newState[y][x][optionName] = value;
    });
  });
  return newState;
};

export const setDefaultStyle = (data, state) => {
  const newState = state;
  data.forEach(({ x, y }) => {
    newState[y][x].style = newState[y][x].defaultStyle;
  });
  return newState;
};
