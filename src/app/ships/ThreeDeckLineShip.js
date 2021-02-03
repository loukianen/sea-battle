import Ship from './Ship';

export default class ThreeDeckLineShip extends Ship {
  constructor(id) {
    super(id);
    this.health = 3;
    this.shipClass = 'threeDeck';
    this.orientationMapping = {
      east: ({ x, y }) => [{ x: x - 1, y }, { x, y }, { x: x + 1, y }],
      north: ({ x, y }) => [{ x, y: y - 1 }, { x, y }, { x, y: y + 1 }],
    };
  }
}
