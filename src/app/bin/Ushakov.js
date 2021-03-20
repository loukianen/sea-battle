import _ from 'lodash';
import * as utils from './utils'; // { calcArea, isValidCoords, getRandomElFromColl, getEmptyCells } from './utils';

const getValidCoords = (field, coords) => coords
  .filter((item) => utils.isValidShipCoords(field, item));

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
    // first variant is a random shooting at all empty cells;
    if (_.isEmpty(this.enemyShipCoords)) {
      const { cells, cellIds } = utils.getEmptyCells(this.enemyField);
      const cellId = utils.getRandomElFromColl(cellIds);
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
      return utils.getRandomElFromColl(validCoordsForShooting);
    }
    // last variant - random shooting at possible coordinates.
    // 'Without' - means without corners in shipArea
    // 'shipArea' - cells around the ship
    const coords = utils.calcArea(this.enemyShipCoords[0], 'without');
    const validCoords = getValidCoords(this.enemyField, coords);
    return utils.getRandomElFromColl(validCoords);
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
        const area = utils.calcArea(this.enemyShipCoords)
          .filter((item) => utils.isValidCoords(item, 1, this.enemyField.length - 1));
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
    this.setEnemyField(_.cloneDeep(battleField));
    const field = _.cloneDeep(battleField);
    const { ships, shipIds } = { ...flot };
    shipIds.forEach((shipId) => {
      const iter = () => {
        const orientation = utils.getRandomElFromColl(['east', 'north']);
        const ship = ships[shipId];
        const { cells, cellIds } = utils.getEmptyCells(field);
        ship.setOrientation(orientation);
        const mainPoint = cells[utils.getRandomElFromColl(cellIds)].coords;
        ship.setCoords(mainPoint);
        const shipCoords = ship.getCoords(mainPoint);
        const areaCoords = ship.getArea(mainPoint);
        return utils.isValidShipCoords(field, shipCoords) ? { shipCoords, areaCoords } : iter();
      };
      const { shipCoords, areaCoords } = iter();
      shipCoords.forEach(({ x, y }) => {
        field[y][x].style = 'ship';
        field[y][x].shipId = shipId;
      });
      areaCoords
        .filter((item) => utils.isValidCoords(item, 1, field.length - 1))
        .forEach(({ x, y }) => {
          field[y][x].style = 'ship-area';
        });
    });
    const clearedField = field.map((line) => line.map((cell) => {
      const newCell = _.cloneDeep(cell);
      if (cell.style === 'ship-area') {
        newCell.style = cell.defaultStyle;
      }
      return newCell;
    }));
    return { ships, shipIds, field: clearedField };
  }
}

export default Ushakov;
