import _ from 'lodash';
import { calcArea, isValidCoords, getRandomElFromColl } from './utils';

const trimField = (field) => field.slice(1).map((line) => line.slice(1));

const getEmptyCells = (field) => {
  let cells = {};
  const cellIds = [];
  const trimedField = trimField(field);
  trimedField.forEach((line) => {
    line.forEach((cell) => {
      const { id, style } = cell;
      if (style !== 'ship' && style !== 'ship-area') {
        cells = { ...cells, [id]: cell };
        cellIds.push(id);
      }
    });
  });
  return { cells, cellIds };
};

const isValidShipCoords = (field, shipCoords) => {
  const coords = _.isArray(shipCoords) ? shipCoords : [shipCoords];
  const maxValue = field.length - 1;
  if (!isValidCoords(coords, 1, maxValue)) {
    return false;
  }
  return coords.every(({ x, y }) => {
    const cellStyle = field[y][x].style;
    return (cellStyle !== 'ship' && cellStyle !== 'ship-area');
  });
};

const getValidCoords = (field, coords) => coords
  .filter((item) => isValidShipCoords(field, item));

class Ushakov {
  constructor() {
    this.enemyField = [];
    this.enemyShipCoords = [];
  }

  getEnemyField() {
    return this.enemyField;
  }

  getEnemyShipCoords() {
    return this.enemyShipCoords;
  }

  shoot() {
    // console.log(JSON.stringify(this.enemyShipCoords));
    // first variant is a random shooting at all empty cells;
    if (_.isEmpty(this.enemyShipCoords)) {
      const { cells, cellIds } = getEmptyCells(this.enemyField);
      const cellId = getRandomElFromColl(cellIds);
      return cells[cellId].coords;
    }
    // second: we should shooting on ends of the ship (the ship has line config)
    if (this.enemyShipCoords.length > 1) {
      const lines = this.enemyShipCoords.reduce((acc, { x, y }) => {
        acc.x.push(x);
        acc.y.push(y);
        return acc;
      }, { x: [], y: [] });
      lines.x = _.sortedUniq(lines.x.sort((a, b) => a - b));
      lines.y = _.sortedUniq(lines.y.sort((a, b) => a - b));
      const mainLine = lines.x.length === 1 ? 'y' : 'x';
      const slaveLine = lines.x.length === 1 ? 'x' : 'y';
      const coordsForShooting = [
        { [mainLine]: _.head(lines[mainLine]) - 1, [slaveLine]: lines[slaveLine][0] },
        { [mainLine]: _.last(lines[mainLine]) + 1, [slaveLine]: lines[slaveLine][0] },
      ];
      const validCoordsForShooting = getValidCoords(this.enemyField, coordsForShooting);
      // console.log(JSON.stringify(this.enemyShipCoords));
      return getRandomElFromColl(validCoordsForShooting);
    }
    // last variant - random shooting at possible coordinates.
    // 'Without' - means without corners in shipArea
    const coords = calcArea(this.enemyShipCoords[0], 'without');
    const validCoords = getValidCoords(this.enemyField, coords);
    return getRandomElFromColl(validCoords);
  }

  handleSootingResult({ coords, result }) {
    const handleSootingMapping = {
      offTarget: ({ x, y }) => {
        this.enemyField[y][x].style = 'ship-area';
      },
      wounded: ({ x, y }) => {
        this.enemyField[y][x].style = 'ship';
        this.enemyShipCoords.push({ x, y });
      },
      killed: ({ x, y }) => {
        this.enemyField[y][x].style = 'ship';
        this.enemyShipCoords.push({ x, y });
        const area = calcArea(this.enemyShipCoords)
          .filter((item) => isValidCoords(item, 1, this.enemyField.length - 1));
        area.forEach(({ x: gor, y: vert }) => {
          this.enemyField[vert][gor].style = 'ship-area';
        });
        this.enemyShipCoords = [];
      },
    };
    if (!Object.keys(handleSootingMapping).includes(result)) {
      return new Error('Unknown shooting result');
    }
    handleSootingMapping[result](coords);
    return true;
  }

  setEnemyField(field) {
    this.enemyField = field;
    this.enemyShipCoords = [];
  }

  setFlot(battleField, flot) {
    this.setEnemyField([...battleField]);
    const field = [...battleField];
    const { ships, shipIds } = { ...flot };
    shipIds.forEach((shipId) => {
      const iter = () => {
        const orientation = getRandomElFromColl(['east', 'north']);
        const ship = ships[shipId];
        const { cells, cellIds } = getEmptyCells(field);
        ship.setOrientation(orientation);
        const mainPoint = cells[getRandomElFromColl(cellIds)].coords;
        ship.setCoords(mainPoint);
        const shipCoords = ship.getCoords(mainPoint);
        const areaCoords = ship.getArea(mainPoint);
        return isValidShipCoords(field, shipCoords) ? { shipCoords, areaCoords } : iter();
      };
      const { shipCoords, areaCoords } = iter();
      shipCoords.forEach(({ x, y }) => {
        field[y][x].style = 'ship';
        field[y][x].shipId = shipId;
      });
      areaCoords
        .filter((item) => isValidCoords(item, 1, field.length - 1))
        .forEach(({ x, y }) => {
          field[y][x].style = 'ship-area';
        });
    });
    return { ships, shipIds, field };
  }
}

export default Ushakov;
