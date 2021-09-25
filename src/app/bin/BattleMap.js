export default class BattleMap {
  constructor(mapSize) {
    this.squareIds = [];
    this.squares = {};
    this.makeMap(mapSize);
  }

  getSquares() {
    return {
      size: this.map.length,
      squareIds: this.squareIds,
      squares: this.squares,
    };
  }

  makeMap(size) {
    this.map = Array(size).fill([]).map((arr, indexY) => {
      for (let indexX = 0; indexX < size; indexX += 1) {
        const id = String(101 + 100 * indexY + indexX);
        arr.push(id);
        this.squareIds.push(id);
        this.squares[id] = { id, type: 'clear', coords: { x: indexX, y: indexY } };
      }
      return arr;
    });
  }
}
