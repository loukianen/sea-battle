import Coords from './Coords';

const argError = (name) => new Error(`${name} should be string type and shouldn't be empty`);

const isArgCorrect = (data) => (
  typeof data === 'string' && data.length > 0
);

const checkArgs = (args) => {
  const argNames = Object.keys(args);
  const { id, type, shipId } = args;
  const mapping = {
    id: () => {
      if (!isArgCorrect(id)) {
        throw argError('id');
      }
      return true;
    },
    type: () => {
      if (!isArgCorrect(type)) {
        throw argError('type');
      }
      return true;
    },
    shipId: () => {
      if (type === 'ship' || type === 'killed-ship') {
        if (!isArgCorrect(shipId)) {
          throw argError('shipId');
        }
      }
      return true;
    },
  };
  return argNames.every((argName) => mapping[argName]());
};

export default class Square {
  constructor(sqId, sqCoords, sqType = 'clear', sqShipId = null) {
    this.setAll(sqId, sqCoords, sqType, sqShipId);
  }

  getAll() {
    return {
      id: this.id,
      coords: this.coords,
      type: this.type,
      shipId: this.shipId,
    };
  }

  getCoords() {
    return this.coords;
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getShipId() {
    return this.shipId;
  }

  setAll(id, coords, type, shipId) {
    checkArgs({ id, type, shipId });
    this.coords = coords instanceof Coords ? coords : new Coords(coords);
    this.id = id;
    this.type = type;
    this.shipId = shipId;
  }

  setType(type, shipId = null) {
    checkArgs({ type, shipId });
    this.type = type;
    this.shipId = shipId;
    return true;
  }
}
