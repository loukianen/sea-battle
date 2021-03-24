import _ from 'lodash';
import Ushakov from './Ushakov';
import DoubleDeckShip from '../ships/DoubleDeckShip';
import ThreeDeckShip from '../ships/ThreeDeckLineShip';
import FourDeckShip from '../ships/FourDeckLineShip';
import * as utils from './utils';

const getMostCommonValues = (inputValues) => {
  const valuesAmounts = {};
  inputValues.forEach((item) => {
    if (valuesAmounts[item]) {
      valuesAmounts[item] += 1;
    } else {
      valuesAmounts[item] = 1;
    }
  });
  let maxFrequency = 0;
  const valuesAmountsParts = Object.entries(valuesAmounts);
  valuesAmountsParts.forEach(([, value]) => {
    if (value > maxFrequency) {
      maxFrequency = value;
    }
  });
  const mostCommonValues = valuesAmountsParts
    .filter(([, value]) => value === maxFrequency)
    .map(([key]) => key);
  return mostCommonValues;
};

const validateShipCoords = (field, coords, validationType) => {
  const gaugeForCoords = [1, field.length - 1];
  const isCoordsBelongToTheEdge = coords
    .every(({ x, y }) => (gaugeForCoords.includes(x) && gaugeForCoords.includes(y)));
  const isCoordsValid = utils.isValidShipCoords(field, coords);
  const validationMapping = {
    beginning: isCoordsValid,
    workAtTheEdge: isCoordsBelongToTheEdge && isCoordsValid,
    standart: isCoordsValid,
  };
  return validationMapping[validationType] ? coords : [];
};

class Nahimov extends Ushakov {
  constructor() {
    super();
    this.enemyShipsAmount = [0, 0, 0, 0];
    this.isGotHit = false;
    this.mode = null; // beginning, workAtTheEdge, standart
    this.targetOffCount = 0;
    this.doubleDeckShip = new DoubleDeckShip();
    this.threeDeckShip = new ThreeDeckShip();
    this.fourDeckShip = new FourDeckShip();
  }

  handleSootingResult({ coords, result }) {
    if (result === 'killed') {
      const index = (this.enemyShipsAmount.length - 1) - this.enemyShipCoords.length;
      this.enemyShipsAmount[index] -= 1;
      this.isGotHit = true;
    }
    if (result === 'wounded') {
      this.isGotHit = true;
    }
    if (result === 'offTarget') {
      this.targetOffCount += 1;
      if (this.mode === 'beginning'
        && this.targetOffCount === this.enemyField.length - 3
        && !this.isGotHit) {
        this.mode = 'workAtTheEdge';
        this.targetOffCount = 0;
      }
      if (this.mode === 'workAtTheEdge' && this.targetOffCount === this.enemyField.length + 2) {
        this.mode = 'standart';
      }
    }
    return Ushakov.prototype.handleSootingResult.call(this, { coords, result });
  }

  getEnemyShipsAmount() {
    return this.enemyShipsAmount;
  }

  setEnemyShipsAmount(shipAmount) {
    this.enemyShipsAmount = shipAmount;
  }

  makeShoot(ship, { cells, cellIds }) {
    const posibleCoordsForEnemyShips = cellIds.reduce((acc, id) => {
      const validShipCoords = [];
      ship.setCoords(cells[id].coords);
      validShipCoords
        .push(...validateShipCoords(this.getEnemyField(), ship.getCoords(), this.mode));
      ship.changeOrientation();
      validShipCoords
        .push(...validateShipCoords(this.getEnemyField(), ship.getCoords(), this.mode));
      return [...acc, ...validShipCoords];
    }, []);
    const idsFromCoords = posibleCoordsForEnemyShips.map(({ x, y }) => {
      const field = this.getEnemyField();
      return field[y][x].id;
    });
    const mostCommonIds = getMostCommonValues(idsFromCoords);
    const idForShoot = utils.getRandomElFromColl(mostCommonIds);
    return idForShoot ? cells[idForShoot].coords : {};
  }

  setFlot(battleField, flot) {
    const { ships, shipIds } = flot;
    shipIds.forEach((id) => {
      switch (ships[id].shipClass) {
        case ('fourDeck'):
          this.enemyShipsAmount[0] += 1;
          break;
        case 'threeDeck':
          this.enemyShipsAmount[1] += 1;
          break;
        case 'doubleDeck':
          this.enemyShipsAmount[2] += 1;
          break;
        case 'oneDeck':
          this.enemyShipsAmount[3] += 1;
          break;
        default:
          throw new Error('Unknown ship class');
      }
    });
    this.mode = 'beginning';
    return Ushakov.prototype.setFlot.call(this, battleField, flot);
  }

  setMode(mode) {
    this.mode = mode;
  }

  shootAtTheEdge({ cells, cellIds }) {
    const theEdgeAreaCellIds = utils.getTheEdgeAreaCellIds(this.enemyField.length - 1);
    const cellsIdsForCheck = _.intersection(cellIds, theEdgeAreaCellIds);
    if (cellsIdsForCheck.length <= 1) {
      this.mode = 'standart';
    }
    if (_.isEmpty(cellsIdsForCheck)) {
      return Ushakov.prototype.shoot.call(this);
    }
    const edgeCells = { cells, cellIds: cellsIdsForCheck };
    const shootAtFourDeckShip = this.makeShoot(this.fourDeckShip, edgeCells);
    if (!_.isEmpty(shootAtFourDeckShip)) {
      return shootAtFourDeckShip;
    }
    const shootAtThreeDeckShip = this.makeShoot(this.threeDeckShip, edgeCells);
    if (!_.isEmpty(shootAtThreeDeckShip)) {
      return shootAtThreeDeckShip;
    }
    const shootAtDoubleDeckShip = this.makeShoot(this.doubleDeckShip, edgeCells);
    if (!_.isEmpty(shootAtDoubleDeckShip)) {
      return shootAtDoubleDeckShip;
    }
    return cells[utils.getRandomElFromColl(cellsIdsForCheck)].coords;
  }

  shoot() {
    if (this.enemyShipCoords.length > 0) { // if is wounded enemy ship
      return Ushakov.prototype.shoot.call(this);
    }
    const emptyCells = utils.getEmptyCells(this.getEnemyField());
    if (this.mode === 'workAtTheEdge') {
      return this.shootAtTheEdge(emptyCells);
    }
    if (this.enemyShipsAmount[0] > 0) { // in search of fourdeck ship
      return this.makeShoot(this.fourDeckShip, emptyCells);
    }
    if (this.enemyShipsAmount[1] > 0) { // threedeck
      return this.makeShoot(this.threeDeckShip, emptyCells);
    }
    if (this.enemyShipsAmount[2] > 0) { // doubledeck
      return this.makeShoot(this.doubleDeckShip, emptyCells);
    }
    this.mode = 'standart';
    return Ushakov.prototype.shoot.call(this); // usual shoot
  }
}

export default Nahimov;
