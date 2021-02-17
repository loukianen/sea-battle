import { calcArea, isValidCoords } from '../src/app/bin/utils';

export default class FakeEnemyForGetShoot {
  constructor(coords) {
    this.coords = coords;
    this.curIndex = 0;
    this.enemyField = [];
    this.enemyShipCoords = [];
  }

  shoot() {
    const shootCoords = this.coords[this.curIndex];
    this.curIndex = this.curIndex === this.coords.length - 1 ? 0 : this.curIndex + 1;
    return shootCoords;
  }

  setEnemyField(map) {
    this.enemyField = map;
  }

  setEnemyShipCoords(coords) {
    this.enemyShipCoords = coords;
  }

  getEnemyField() {
    return this.enemyField;
  }

  getEnemyShipCoords() {
    return this.enemyShipCoords;
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
        const area = calcArea(this.enemyShipCoords)
          .filter((item) => isValidCoords(item, 1, this.enemyField.length - 1));
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
