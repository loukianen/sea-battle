import OneDeckShip from '../src/app/ships/OneDeckShip';
import DoubleDeckShip from '../src/app/ships/DoubleDeckShip';
import ThreeDeckLineShip from '../src/app/ships/ThreeDeckLineShip';
import FourDeckLineShip from '../src/app/ships/FourDeckLineShip';

const mainPoint = { x: 2, y: 2 };
const wrongMainPoints = [{ x: -1, y: 2 }, { x: 2, y: 2.2 }, [][0]];

const oneDeckShipData = [
  new OneDeckShip(1),
  [mainPoint],
  [mainPoint],
  ['killed', 'shot at the dead', 'shot at the dead', 'shot at the dead', 'shot at the dead'],
  1,
];

const doubleDeckShipData = [
  new DoubleDeckShip(2),
  [{ x: 2, y: 2 }, { x: 3, y: 2 }],
  [{ x: 2, y: 2 }, { x: 2, y: 3 }],
  ['wounded', 'killed', 'shot at the dead', 'shot at the dead', 'shot at the dead'],
  2,
];

const threeDeckLineShipData = [
  new ThreeDeckLineShip(3),
  [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
  [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
  ['wounded', 'wounded', 'killed', 'shot at the dead', 'shot at the dead'],
  3,
];

const fourDeckLineShippData = [
  new FourDeckLineShip(4),
  [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }],
  [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }],
  ['wounded', 'wounded', 'wounded', 'killed', 'shot at the dead'],
  4,
];

const data = [
  oneDeckShipData,
  doubleDeckShipData,
  threeDeckLineShipData,
  fourDeckLineShippData,
];

test('whisout Id', () => {
  const ship = new OneDeckShip();
  expect(ship.getId()).toBeNull();
});

test.each(data)('ship(%s)', (ship, coords, verticalCoords, answersForHit, expectHealth) => {
  expect(ship.getId()).toBe(expectHealth);
  expect(ship.getCoords()).toEqual([]);
  expect(ship.setCoords(mainPoint)).toBeTruthy();
  expect(ship.getCoords()).toEqual(coords);
  expect(ship.changeOrientation()).toEqual(verticalCoords);
  expect(ship.changeOrientation()).toEqual(coords);
  wrongMainPoints.forEach((point) => {
    expect(ship.setCoords(point)).toBeInstanceOf(Error);
  });
  expect(ship.health).toBe(expectHealth);
  answersForHit.forEach((answer) => {
    expect(ship.hit()).toBe(answer);
  });
});
