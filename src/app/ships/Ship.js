import _ from 'lodash';
import { calcArea } from '../bin/utils';

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

  getHealth() {
    return this.health;
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
