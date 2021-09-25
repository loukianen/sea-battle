const dataErr = new Error('Coords data should be two number or array with two number or { x, y }');

const convertToNumber = (data) => data.map((el) => {
  if (typeof el === 'string' || typeof el === 'number') {
    return Number(el);
  }
  throw dataErr;
});

const getCoordsFromOneArg = (data) => {
  const arg = data[0];
  if (arg instanceof Array && arg.length === 2) {
    return convertToNumber(arg);
  }
  const { x, y } = arg;
  if (x && y) {
    return convertToNumber([x, y]);
  }
  throw dataErr;
};

const normalizeData = (data) => {
  const argsCount = data.length;
  if (argsCount === 1) {
    return getCoordsFromOneArg(data);
  }
  if (argsCount === 2) {
    return convertToNumber(data);
  }
  throw dataErr;
};

export default class Coords {
  constructor(...coordsData) {
    try {
      this.setCoodrs(coordsData);
    } catch (e) {
      throw dataErr;
    }
  }

  setCoodrs(data) {
    const [x, y] = normalizeData(data);
    this.x = x;
    this.y = y;
    return true;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}
