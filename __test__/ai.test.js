import _ from 'lodash';
import Ushakov from '../src/app/bin/Ushakov';
import getFieldData from '../src/app/bin/genFieldData';
import makeFlot from '../src/app/bin/makeFlot';
import { calcArea, isValidCoords, getRandomElFromColl } from '../src/app/bin/utils';

const gameOptions = { fieldSize: 'ten', enemy: 'ushakov', shipType: 'line' };
const battlefield = getFieldData();
const ushakov = new Ushakov();
const ushakov2 = new Ushakov();
ushakov2.setEnemyField(getFieldData());

// data for setting 10 ships on field 10x10 Ushakov
const { ships: ushkovShips, shipIds: usakovShipIds, field: ushakovField } = ushakov
  .setFlot(battlefield, makeFlot(gameOptions));

// data for Ushakov handleSootingResult({ coords, result })
const firstShoot = { coords: { x: 3, y: 3 }, result: 'offTarget' };
const secondShoot = { coords: { x: 3, y: 4 }, result: 'wounded' };
const thirdShoot = { coords: { x: 3, y: 5 }, result: 'killed' };

const firstField = getFieldData();
firstField[3][3].style = 'ship-area';

const secondField = _.cloneDeep(firstField);
secondField[4][3].style = 'ship';

const thirdField = _.cloneDeep(secondField);
thirdField[5][3].style = 'ship';

const shipArea = calcArea([secondShoot.coords, thirdShoot.coords]);
shipArea.forEach(({ x, y }) => {
  thirdField[y][x].style = 'ship-area';
});

// data for Ushakov shoot()
const field1ForUshakovShootTest = getFieldData();
for (let y = 1; y < field1ForUshakovShootTest.length; y += 1) {
  for (let x = 1; x < field1ForUshakovShootTest.length; x += 1) {
    field1ForUshakovShootTest[y][x].style = getRandomElFromColl(['ship', 'ship-area']);
  }
}
const emptyArea = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 6, y: 5 },
  { x: 6, y: 6 },
];
emptyArea.forEach(({ x, y }) => {
  field1ForUshakovShootTest[y][x].style = 'cell';
});
const fourthShoot = { coords: { x: 3, y: 5 }, result: 'wounded' };
const fifthSehoot = { coords: { x: 4, y: 4 }, result: 'wounded' };

const verticalEnds = [{ x: 3, y: 3 }, { x: 3, y: 6 }];
const fromVerticalEnsShoot = { coords: { x: 3, y: 3 }, result: 'offTarget' };
const verticalRest = { x: 3, y: 6 };

const gorizontalEnds = [{ x: 2, y: 4 }, { x: 5, y: 4 }];
const fromGorisontalEnsShoot = { coords: { x: 2, y: 4 }, result: 'offTarget' };
const gorizontalRest = { x: 5, y: 4 };

const isValidField = (battleField) => {
  const maxValue = battleField.length - 1;
  return battleField.every((line) => {
    line.every((cell) => {
      const { style, shipId, coords } = cell;
      if (style === 'ship') {
        const area = calcArea(coords).filter((item) => isValidCoords(item, 0, maxValue));
        return area.every((areaCell) => (areaCell.style !== 'ship' || areaCell.shipId === shipId));
      }
      return true;
    });
    return true;
  });
};

const calcShipsCount = (battleField) => {
  const shipIds = new Set();
  const fieldSize = battleField.length;
  for (let row = 0; row < fieldSize; row += 1) {
    for (let col = 0; col < fieldSize; col += 1) {
      const currentCell = battleField[row][col];
      if (currentCell.style === 'ship') {
        shipIds.add(currentCell.shipId);
      }
    }
  }
  return shipIds.size;
};

test('setting 10 ships on field 10x10 Ushakov', () => {
  const totalHealth = usakovShipIds.reduce((acc, id) => acc + ushkovShips[id].getHealth(), 0);
  expect(isValidField(ushakovField)).toBeTruthy();
  expect(calcShipsCount(ushakovField)).toBe(10);
  expect(totalHealth).toBe(20);
});

test('Ushakov handleSootingResult({ coords, result })', () => {
  ushakov2.handleSootingResult(firstShoot);
  expect(ushakov2.enemyField).toEqual(firstField);

  ushakov2.handleSootingResult(secondShoot);
  expect(ushakov2.enemyField).toEqual(secondField);

  ushakov2.handleSootingResult(thirdShoot);
  expect(ushakov2.enemyField).toEqual(thirdField);
});

test('Ushakov shoot() first variant', () => {
  const ushakov3 = new Ushakov();
  ushakov3.setEnemyField(field1ForUshakovShootTest);
  expect(emptyArea).toContainEqual(ushakov3.shoot());
});

test('Ushakov shoot() second variant', () => {
  const ushakov4 = new Ushakov();
  ushakov4.setEnemyField(getFieldData());

  ushakov4.handleSootingResult(secondShoot);
  ushakov4.handleSootingResult(fourthShoot);
  expect(verticalEnds).toContainEqual(ushakov4.shoot());

  ushakov4.handleSootingResult(fromVerticalEnsShoot);
  expect(verticalRest).toEqual(ushakov4.shoot());

  ushakov4.setEnemyField(getFieldData());
  ushakov4.handleSootingResult(secondShoot);
  ushakov4.handleSootingResult(fifthSehoot);
  expect(gorizontalEnds).toContainEqual(ushakov4.shoot());

  ushakov4.handleSootingResult(fromGorisontalEnsShoot);
  expect(gorizontalRest).toEqual(ushakov4.shoot());
});
test('Ushakov shoot() third variant', () => {
  const ushakov5 = new Ushakov();
  ushakov5.setEnemyField(getFieldData());
  const shootResult = { coords: { x: 4, y: 4 }, result: 'wounded' };
  let area = null;
  let shoot = null;
  for (let i = 0; i < 4; i += 1) {
    ushakov5.handleSootingResult(shootResult);
    if (area === null) {
      area = calcArea(shootResult.coords, 'without');
    } else {
      area = _.differenceWith(area, [shoot], _.isEqual);
    }
    shoot = ushakov5.shoot();
    shootResult.coords = shoot;
    shootResult.result = 'offTarget';
    expect(area).toContainEqual(shoot);
  }
});
test('Ushakov shoot() third variant in corner', () => {
  const ushakov6 = new Ushakov();
  ushakov6.setEnemyField(getFieldData());

  const shootResult1 = { coords: { x: 10, y: 10 }, result: 'wounded' };
  const area1 = calcArea(shootResult1.coords, 'without');
  ushakov6.handleSootingResult(shootResult1);
  const shoot1 = ushakov6.shoot();
  expect(area1).toContainEqual(shoot1);

  const shootResult2 = { coords: shoot1, result: 'offTarget' };
  const area2 = _.differenceWith(area1, [shoot1], _.isEqual);
  ushakov6.handleSootingResult(shootResult2);
  const shoot2 = ushakov6.shoot();
  expect(area2).toContainEqual(shoot2);
});
test('Ushakov shoot() second variant in corner', () => {
  const ushakov7 = new Ushakov();
  ushakov7.setEnemyField(getFieldData());
  ushakov7.handleSootingResult({ coords: { x: 10, y: 10 }, result: 'wounded' });
  ushakov7.handleSootingResult({ coords: { x: 9, y: 10 }, result: 'wounded' });
  expect({ x: 8, y: 10 }).toEqual(ushakov7.shoot());
});
