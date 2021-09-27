import BattleMap from '../src/app/bin/BattleMap';
import Coords from '../src/app/bin/Coords';
import Square from '../src/app/bin/Square';

describe('buttle map', () => {
  test.each([3, 5, 7, 10])('is creating right size %s', (mapSize) => {
    const map = new BattleMap(mapSize);
    const { size, squareIds, squares } = map.getSquares();
    const mapSquareIds = Object.keys(squares);

    expect(size).toBe(mapSize);
    expect(squareIds.length).toBe(size ** 2);
    expect(squareIds).toEqual(mapSquareIds);
  });

  const squaresCheckingData = [
    [3, { f: '101', s: '202', t: '303' }],
    [5, { f: '101', s: '303', t: '505' }],
    [7, { f: '101', s: '404', t: '707' }],
    [10, { f: '101', s: '606', t: '1010' }],
  ];

  test.each(squaresCheckingData)('squares checking %s', (mapSize, ids) => {
    const map = new BattleMap(mapSize);
    const firstPosition = 0;
    const middlePosition = Math.round((mapSize - 1) / 2);
    const lastPosition = mapSize - 1;

    expect(map.getSquareById(ids.f)).toEqual(new Square(ids.f, [firstPosition, firstPosition]));
    expect(map.getSquareById(ids.s)).toEqual(new Square(ids.s, [middlePosition, middlePosition]));
    expect(map.getSquareById(ids.t)).toEqual(new Square(ids.t, [lastPosition, lastPosition]));
  });

  test('successful getters test', () => {
    const map = new BattleMap(5);
    const controlSquare = new Square('203', [2, 1]);
    expect(map.getSquareByCoodrs(new Coords([2, 1]))).toEqual(controlSquare);
    expect(map.getSquareById('203')).toEqual(controlSquare);
    expect(map.getSquares()).toMatchObject({
      size: expect.any(Number),
      squareIds: expect.any(Array),
      squares: expect.any(Object),
    });
  });

  test('unsuccessful getters test', () => {
    const map = new BattleMap();
    expect(() => map.getSquareByCoodrs([2, 1]))
      .toThrowError(/^Argument of function getSquareByCoodrs should be instance of Coords class$/);
    expect(() => map.getSquareById(203))
      .toThrowError(/^Argument of function getSquareById should be string$/);
  });
});
