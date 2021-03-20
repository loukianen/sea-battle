// import _ from 'lodash';
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

class Nahimov extends Ushakov {
  constructor() {
    super();
    this.enemyShipsAmount = [0, 0, 0, 0];
    this.doubleDeckShip = new DoubleDeckShip();
    this.threeDeckShip = new ThreeDeckShip();
    this.fourDeckShip = new FourDeckShip();
  }

  handleSootingResult({ coords, result }) {
    if (result === 'killed') {
      const index = (this.enemyShipsAmount.length - 1) - this.enemyShipCoords.length;
      this.enemyShipsAmount[index] -= 1;
    }
    return Ushakov.prototype.handleSootingResult.call(this, { coords, result });
  }

  isHaveToMakeSpecShoot() {
    return this.enemyShipCoords.length === 0 && (
      this.enemyShipsAmount[0] > 0
      || this.enemyShipsAmount[1] > 0
      || this.enemyShipsAmount[2] > 0
    );
  }

  getEnemyShipsAmount() {
    return this.enemyShipsAmount;
  }

  setEnemyShipsAmount(shipAmount) {
    this.enemyShipsAmount = shipAmount;
  }

  makeShoot(ship, { cells, cellIds }) {
    const posibleCoordsForEnemyShips = [];
    cellIds.forEach((id) => {
      const addCoordsToList = (coords) => {
        if (utils.isValidShipCoords(this.getEnemyField(), coords)) {
          posibleCoordsForEnemyShips.push(...coords);
        }
      };
      ship.setCoords(cells[id].coords);
      addCoordsToList(ship.getCoords());
      ship.changeOrientation();
      addCoordsToList(ship.getCoords());
    });
    const idsFromCoords = posibleCoordsForEnemyShips.map(({ x, y }) => {
      const field = this.getEnemyField();
      return field[y][x].id;
    });
    const mostCommonIds = getMostCommonValues(idsFromCoords);
    const idForShoot = utils.getRandomElFromColl(mostCommonIds);
    return cells[idForShoot].coords;
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
    return Ushakov.prototype.setFlot.call(this, battleField, flot);
  }

  shoot() {
    return this.isHaveToMakeSpecShoot() ? this.specShoot() : Ushakov.prototype.shoot.call(this);
  }

  specShoot() {
    const emptyCells = utils.getEmptyCells(this.getEnemyField());
    if (this.enemyShipsAmount[0] > 0) {
      return this.makeShoot(this.fourDeckShip, emptyCells);
    }
    if (this.enemyShipsAmount[1] > 0) {
      return this.makeShoot(this.threeDeckShip, emptyCells);
    }
    if (this.enemyShipsAmount[2] > 0) {
      return this.makeShoot(this.doubleDeckShip, emptyCells);
    }
    throw new Error("specShoot haven't been called");
  }
}

export default Nahimov;
