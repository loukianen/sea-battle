export default class FakeEnemyForGetShoot {
  constructor(coords) {
    this.coords = coords;
    this.curIndex = 0;
  }

  shoot() {
    const shootCoords = this.coords[this.curIndex];
    this.curIndex = this.curIndex === 0 ? 1 : 0;
    return shootCoords;
  }
}
