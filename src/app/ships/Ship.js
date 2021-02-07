import _ from 'lodash';

const validOrientationValues = ['east', 'north'];

const isValidOrientation = (value) => validOrientationValues.includes(value);

const isValidMainPoint = (point) => {
  if (!point) {
    return false;
  }
  const { x, y } = point;
  return (
    _.isInteger(x)
    && _.isInteger(y)
    && x >= 0
    && y >= 0
  );
};

const calcArea = (coords) => {
  const pointsAreas = coords.map(({ x, y }) => {
    const res = [];
    let curX = x - 1;
    let curY = y - 1;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        res.push({ x: curX, y: curY });
        curX += 1;
      }
      curX = x - 1;
      curY += 1;
    }
    return res;
  });
  const areaWithShipCoords = _.uniqWith(_.flatten(pointsAreas), _.isEqual);
  const area = _.differenceWith(areaWithShipCoords, coords, _.isEqual);
  return area;
};

export default class {
  constructor(id) {
    this.id = id || null;
    this.health = 0;
    this.coords = [];
    this.mainPoint = null;
    this.shipClass = null;
    this.orientation = 'east';
  }

  getCoords() {
    return this.coords;
  }

  getArea() {
    return calcArea(this.getCoords());
  }

  getId() {
    return this.id;
  }

  getClass() {
    return this.shipClass;
  }

  hit() {
    if (this.health === 0) {
      return 'shot at the dead';
    }
    this.health -= 1;
    if (this.health === 0) {
      return 'killed';
    }
    return 'wounded';
  }

  calcCoords(mainPoint) {
    return this.orientationMapping[this.orientation](mainPoint);
  }

  setCoords(mainPoint) {
    if (!isValidMainPoint(mainPoint)) {
      return new Error('Invalid coordinates received');
    }
    this.mainPoint = mainPoint;
    this.coords = this.calcCoords(this.mainPoint);
    return true;
  }

  setOrientation(orientation) {
    if (!isValidOrientation(orientation)) {
      return new Error('Unknown orientation');
    }
    this.orientation = orientation;
    return true;
  }

  changeOrientation() {
    if (this.mainPoint !== null) {
      this.orientation = this.orientation === 'east' ? 'north' : 'east';
      this.coords = this.orientationMapping[this.orientation](this.mainPoint);
    }
    return this.getCoords();
  }
}
