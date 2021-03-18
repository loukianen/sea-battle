import _ from 'lodash';
import Ushakov from './Ushakov';
import * as utils from './utils';

class JackSparrow extends Ushakov {
  addKilledShipCoords(shoot) {
    const shipCoords = [];
    const iter = (coords) => {
      if (!_.includes(shipCoords, coords)) {
        shipCoords.push(coords);
      }
      const cellsForCheck = utils
        .calcArea(coords, 'without')
        .filter((cell) => utils.isValidCoords(cell));
      cellsForCheck.forEach(({ x, y }) => {
        if (this.enemyField[y][x].style === 'ship') {
          iter({ x, y });
        }
      });
    };
    iter(shoot);
    this.enemyShipCoords = shipCoords;
  }

  shoot() {
    const { cells, cellIds } = utils.getEmptyCells(this.enemyField);
    const cellId = utils.getRandomElFromColl(cellIds);
    return cells[cellId].coords;
  }

  handleSootingResult({ coords, result }) {
    const handleSootingMapping = {
      offTarget: ({ x, y }) => {
        this.enemyField[y][x].style = 'ship-area';
      },
      wounded: ({ x, y }) => {
        this.enemyField[y][x].style = 'ship';
      },
      killed: ({ x, y }) => {
        this.enemyField[y][x].style = 'ship';
        this.addKilledShipCoords({ x, y });
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
}

export default JackSparrow;
