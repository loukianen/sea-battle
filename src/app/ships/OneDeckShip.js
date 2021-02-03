import Ship from './Ship';

export default class OneDeckShip extends Ship {
  constructor(id) {
    super(id);
    this.health = 1;
    this.shipClass = 'oneDeck';
    this.orientationMapping = {
      east: ({ x, y }) => [{ x, y }],
      north: ({ x, y }) => [{ x, y }],
    };
  }
}
