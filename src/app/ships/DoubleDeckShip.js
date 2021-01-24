import Ship from './Ship';

export default class DoubleDeckShip extends Ship {
  constructor(id) {
    super(id);
    this.health = 2;
    this.orientationMapping = {
      east: ({ x, y }) => [{ x, y }, { x: x + 1, y }],
      north: ({ x, y }) => [{ x, y }, { x, y: y + 1 }],
    };
  }
}
