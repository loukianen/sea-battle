import _ from 'lodash';
import OneDeckShip from '../src/app/ships/OneDeckShip';
import DoubleDeckShip from '../src/app/ships/DoubleDeckShip';
import ThreeDeckLineShip from '../src/app/ships/ThreeDeckLineShip';
import FourDeckLineShip from '../src/app/ships/FourDeckLineShip';
import makeFlot from '../src/app/bin/makeFlot';

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

const makeDataForFlotTesting = (options) => {
  const flot = makeFlot(options);

  if (!flot) {
    return {};
  }
  
  const totalUnits = _.reduce(flot, (acc, ships) => {
    acc = acc + ships.length;
    return acc;
  }, 0);

  const countShipByType = (source, type) => {
    if (!_.isArray(source)) {
      return 0;
    }
    return source.reduce(
      (acc, ship) => (ship instanceof type ? acc + 1 : acc),
      0,);
  };

  const fourDeckShipsAmount = countShipByType(flot.fourDeckShips, FourDeckLineShip);
  const threeDeckShipsAmount = countShipByType(flot.threeDeckShips, ThreeDeckLineShip);
  const doubleDeckShipsAmount = countShipByType(flot.doubleDeckShips, DoubleDeckShip);
  const oneDeckShipsAmount = countShipByType(flot.oneDeckShips, OneDeckShip);
  const uniqIdsAmount = new Set();

  _.forEach(flot, (ships) => {
    ships.forEach((ship) => {
      uniqIdsAmount.add(ship.getId());
    });
  });

  return {
    totalUnits,
    fourDeckShipsAmount,
    threeDeckShipsAmount,
    doubleDeckShipsAmount,
    oneDeckShipsAmount,
    uniqIdsAmount,
  }
};

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

test('makeFlot with ten size fields and line type ships', () => {
  const {
    totalUnits,
    fourDeckShipsAmount,
    threeDeckShipsAmount,
    doubleDeckShipsAmount,
    oneDeckShipsAmount,
    uniqIdsAmount,
  } = makeDataForFlotTesting({ fieldSize: 'ten', shipType: 'line' });
  expect(totalUnits).toBe(10);
  expect(fourDeckShipsAmount).toBe(1);
  expect(threeDeckShipsAmount).toBe(2);
  expect(doubleDeckShipsAmount).toBe(3);
  expect(oneDeckShipsAmount).toBe(4);
  expect(uniqIdsAmount.size).toBe(10);
});

test('makeFlot with three size fields and line type ships', () => {
  const {
    totalUnits,
    fourDeckShipsAmount,
    threeDeckShipsAmount,
    doubleDeckShipsAmount,
    oneDeckShipsAmount,
    uniqIdsAmount,
  } = makeDataForFlotTesting({ fieldSize: 'three', shipType: 'line' });
  expect(totalUnits).toBe(1);
  expect(fourDeckShipsAmount).toBe(0);
  expect(threeDeckShipsAmount).toBe(0);
  expect(doubleDeckShipsAmount).toBe(0);
  expect(oneDeckShipsAmount).toBe(1);
  expect(uniqIdsAmount.size).toBe(1);
});