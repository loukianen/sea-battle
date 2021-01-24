import Ship from './Ship';

export default class FourDeckLineShip extends Ship {
  constructor(id) {
    super(id);
    this.health = 4;
    this.orientationMapping = {
      east: ({ x, y }) => [{ x: x - 1, y }, { x, y }, { x: x + 1, y }, { x: x + 2, y }],
      north: ({ x, y }) => [{ x, y: y - 1 }, { x, y }, { x, y: y + 1 }, { x, y: y + 2 }],
    };
  }
}
