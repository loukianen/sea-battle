import Coords from '../src/app/bin/Coords';

describe('Coords create', () => {
  test.each([
    [[1, '2']],
    [[[1, '2']]],
    [[{ x: 1, y: '2' }]],
  ])('with correct data %s', (args) => {
    const correctCoords = new Coords(...args);
    const x = correctCoords.getX();
    const y = correctCoords.getY();
    expect(x).toBe(1);
    expect(y).toBe(2);
  });

  test('with incorrect data', () => {
    expect(() => new Coords(null, NaN))
      .toThrowError(/^Coords data should be two number or array with two number or { x, y }$/);
    expect(() => new Coords(1))
      .toThrowError(/^Coords data should be two number or array with two number or { x, y }$/);
    expect(() => new Coords([1]))
      .toThrowError(/^Coords data should be two number or array with two number or { x, y }$/);
    expect(() => new Coords([1, 2], [3, 4]))
      .toThrowError(/^Coords data should be two number or array with two number or { x, y }$/);
    expect(() => new Coords({ m: 2, n: 3 }))
      .toThrowError(/^Coords data should be two number or array with two number or { x, y }$/);
    expect(() => new Coords({ x: 2, y: 3 }, { x: 4, y: 5 }))
      .toThrowError(/^Coords data should be two number or array with two number or { x, y }$/);
  });
});
