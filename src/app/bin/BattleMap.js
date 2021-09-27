import Coords from './Coords';
import Square from './Square';

export default class BattleMap {
  constructor(mapSize = 10) {
    this.squareIds = [];
    this.squares = {};
    this.makeMap(mapSize);
  }

  getSquareByCoodrs(coords) {
    if (coords instanceof Coords) {
      const squareId = this.map[coords.getY()][coords.getX()];
      return this.squares[squareId];
    }
    throw new Error('Argument of function getSquareByCoodrs should be instance of Coords class');
  }

  getSquareById(squareId) {
    if (typeof squareId === 'string') {
      return this.squares[squareId];
    }
    throw new Error('Argument of function getSquareById should be string');
  }

  getSquares() {
    return {
      size: this.map.length,
      squareIds: this.squareIds,
      squares: this.squares,
    };
  }

  makeMap(size) {
    this.map = Array(size).fill(101).map((startId, indexY) => {
      const res = [];
      for (let indexX = 0; indexX < size; indexX += 1) {
        const id = String(startId + 100 * indexY + indexX);
        res.push(id);
        this.squareIds.push(id);
        this.squares[id] = new Square(id, [indexX, indexY]);
      }
      return res;
    });
  }

  markSquareAsClear(id) {
    this.squares[id].setType('clear');
  }

  markSquareAsFired(id) {
    this.squares[id].setType('fired');
  }

  markSquareAsShip(id, shipId) {
    this.squares[id].setType('ship', shipId);
  }

  markSquareAsKilledShip(id, shipId) {
    this.squares[id].setType('killed-ship', shipId);
  }
}
