import Square from '../src/app/bin/Square';
import Coords from '../src/app/bin/Coords';

describe('Square class testing', () => {
  test('sucssesful creating', () => {
    const id = '102';
    const coords = [0, 1];

    const typeDefaultSquare = new Square(id, coords);
    const typeDfaultGauge = {
      id: '102', coords: new Coords(0, 1), type: 'clear', shipId: null,
    };
    expect(typeDefaultSquare.getAll()).toEqual(typeDfaultGauge);

    const typeShipSquare = new Square(id, coords, 'ship', 's2');
    const typeShipGauge = {
      id: '102', coords: new Coords(0, 1), type: 'ship', shipId: 's2',
    };
    expect(typeShipSquare.getAll()).toEqual(typeShipGauge);

    const typeAnySquare = new Square(id, coords, 'anyType');
    const typeAnyGauge = {
      id: '102', coords: new Coords(0, 1), type: 'anyType', shipId: null,
    };
    expect(typeAnySquare.getAll()).toEqual(typeAnyGauge);
  });

  test('get-metods testing', () => {
    const square = new Square('102', [0, 1], 'killed-ship', 's2');
    expect(square.getId()).toBe('102');
    expect(square.getCoords()).toEqual(new Coords(0, 1));
    expect(square.getType()).toBe('killed-ship');
    expect(square.getShipId()).toBe('s2');
  });

  test('setType() method testing', () => {
    const square1 = new Square('102', [0, 1]);
    expect(square1.getType()).toBe('clear');
    square1.setType('anyType'); // set any type
    expect(square1.getType()).toBe('anyType');

    const square2 = new Square('102', [0, 1], 'ship', 's2');
    expect(square2.getType()).toBe('ship');
    square2.setType('killed-ship', 's2'); // set 'killed-ship' type with shipId
    expect(square2.getType()).toBe('killed-ship');

    const square3 = new Square('102', [0, 1]);
    expect(square3.getType()).toBe('clear');
    // set 'ship' type without shipId
    expect(() => square3.setType('ship'))
      .toThrowError(/^shipId should be string type and shouldn't be empty$/);
  });

  test('unsucssesful creating', () => {
    expect(() => new Square()).toThrowError();
    expect(() => new Square(1))
      .toThrowError(/^id should be string type and shouldn't be empty$/);
    expect(() => new Square('1', []))
      .toThrowError(/^Coords data should be two number or array with two number or { x, y }$/);
    expect(() => new Square('1', [3, 4], [3, 4]))
      .toThrowError(/^type should be string type and shouldn't be empty$/);
    expect(() => new Square('1', [3, 4], 'ship'))
      .toThrowError(/^shipId should be string type and shouldn't be empty$/);
    expect(() => new Square('1', [3, 4], 'ship', 2))
      .toThrowError(/^shipId should be string type and shouldn't be empty$/);
  });
});
