import BattleMap from '../src/app/bin/BattleMap';

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
    [3],
    [5],
    [7],
    [10],
  ];

  test.each(squaresCheckingData)('has right sqeares (size %s)', (mapSize, gaugeSquares) => {
    const map = new BattleMap(mapSize);
    const { squareIds, squares } = map.getSquares();

    const firstSqueare = squares[101];

    expect(size).toBe(mapSize);
    expect(squareIds.length).toBe(size ** 2);
    expect(squareIds).toEqual(mapSquareIds);
  });
});
