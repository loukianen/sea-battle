import _ from 'lodash';

const mainPointIsValid = (point) => {
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

export default class {
  constructor(id) {
    this.id = id || null;
    this.health = 0;
    this.coords = [];
    this.mainPoint = null;
    this.shipClass = null;
  }

  getCoords() {
    return this.coords;
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

  setCoords(mainPoint) {
    if (!mainPointIsValid(mainPoint)) {
      return new Error('Invalid coordinates received');
    }
    this.mainPoint = mainPoint;
    this.orientation = 'east';
    this.coords = this.orientationMapping[this.orientation](this.mainPoint);
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
